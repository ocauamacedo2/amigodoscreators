// ===============================
// SANTA CREATORS — QUIZ DIÁRIO 📚
// ===============================
// • Módulo separado para manter o index.js limpo.

import fs from 'fs';
import { SC_QUIZ_BANK } from './questions.js';

// Polyfill para fetch em versões antigas do Node, se necessário
if (typeof fetch === 'undefined') {
  const { fetch: undiciFetch } = await import('undici');
  globalThis.fetch = undiciFetch;
}

export async function setupQuiz(client) {
  try {
    if (client.__SC_QUIZ_INSTALLED) {
      console.log("[SC_QUIZ] Já instalado, pulando.");
      return;
    }
    client.__SC_QUIZ_INSTALLED = true;

    // ========== CONFIG ==========
    const SC_QUIZ_CREATORS_CHANNEL_ID = '1381597720007151698';
    const SC_QUIZ_RANKING_CHANNEL_ID  = '1495330319715532880';
    const SC_QUIZ_LOGS_CHANNEL_ID     = '1415390219779313808';
    const SC_MENTION_ROLES = ['1262978759922028575', '1352275728476930099'];

    const SC_QUIZ_DAILY_COUNT         = 10;
    const SC_QUIZ_WINDOW_START_HOUR   = 10;
    const SC_QUIZ_WINDOW_END_HOUR     = 22;
    const SC_QUIZ_MIN_GAP_MINUTES     = 25;
    const SC_QUIZ_DM_TIMEOUT_MS       = 3 * 60 * 1000;
    const SC_QUIZ_EXTRA_DM_QUESTIONS  = 3;
    const SC_QUIZ_DATA_PATH           = './sc_quiz_data.json';
    const SC_QUIZ_POINTS_RIGHT        = 1;

    const SC_RT_EVERY_MINUTES         = 30;
    const SC_RT_DAILY_COUNT           = 15;
    const SC_RT_WINDOW_START_HOUR     = 12;
    const SC_RT_WINDOW_END_HOUR       = 23;
    const SC_RT_ACTIVE_TIMEOUT_MS     = 3 * 60 * 1000;

    const GIF_QUIIZ_URL = 'https://media.discordapp.net/attachments/1362477839944777889/1374893068649500783/standard_1.gif?ex=68c2b3b3&is=68c16233&hm=fb2088e9693479fdae08076fc482855004e662ed1a788e7b9788eff44b1c7dd6&=&width=1032&height=60';

    const SC_RT_BANK = SC_QUIZ_BANK;

    let SC_QUIZ_STATE = {
      leaderboard: {},
      activeQuizMessages: [],
      stickyRankingMsgIdAcertos: null,
      stickyRankingMsgIdInteracoes: null,
      participantsByMsg: {},
      lastScheduleDayKey: null,
      __todaySchedule: [],
      creatorsCleanupMessageIds: [],
      currentValidMessageId: null,
      currentSatisfied: true,
      activity: { counter: 0, threshold: 30 }
    };

    function scq_load() {
      try {
        if (fs.existsSync(SC_QUIZ_DATA_PATH)) {
          const raw = fs.readFileSync(SC_QUIZ_DATA_PATH, 'utf8');
          Object.assign(SC_QUIZ_STATE, JSON.parse(raw));
        }
      } catch (e) {
        console.error("[SC_QUIZ] Erro carregar:", e);
      }
    }

    function scq_save() {
      try {
        fs.writeFileSync(SC_QUIZ_DATA_PATH, JSON.stringify(SC_QUIZ_STATE, null, 2));
      } catch (e) { console.error("[SC_QUIZ] Erro salvar:", e); }
    }

    scq_load();

    SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || { __todayScheduleFast: [], active: null, attempts: {} };

    // ======= HELPERS =======
    function scq_nowBRT() { return new Date(); }
    function scq_dayKey(d = scq_nowBRT()) { return d.toISOString().slice(0, 10); }
    function scq_randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function scq_hasActiveQuiz() { return !!SC_QUIZ_STATE.currentValidMessageId && !SC_QUIZ_STATE.currentSatisfied; }
    
    function scq_hasUserPlayedInRound(messageId, userId) {
      return SC_QUIZ_STATE.participantsByMsg[messageId]?.[userId] || SC_QUIZ_STATE.rt.attempts[messageId]?.[userId];
    }

    function scq_markUserPlayedInRound(messageId, userId, mode = 'daily') {
      if (mode === 'fast') {
        SC_QUIZ_STATE.rt.attempts[messageId] = SC_QUIZ_STATE.rt.attempts[messageId] || {};
        SC_QUIZ_STATE.rt.attempts[messageId][userId] = true;
      } else {
        SC_QUIZ_STATE.participantsByMsg[messageId] = SC_QUIZ_STATE.participantsByMsg[messageId] || {};
        SC_QUIZ_STATE.participantsByMsg[messageId][userId] = true;
      }
    }

    function scq_pickAnswerLetter(raw, q) {
      const s = String(raw).trim().toUpperCase();
      if (/^[A-D]$/.test(s)) return s;
      if (q?.opcoes) {
        const opt = q.opcoes.find(o => o.slice(3).trim().toUpperCase() === s);
        if (opt) return opt[0];
      }
      return null;
    }

    function scq_getRandomQuestion(exclude = new Set()) {
      const pool = SC_QUIZ_BANK.filter(q => !exclude.has(q.id));
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }

    async function scq_userDisplayNameSafe(guild, userId, fallbackName) {
      const member = await guild.members.fetch(userId).catch(() => null);
      return member?.displayName || fallbackName || `User ${userId}`;
    }

    function scq_buildEmbed({ title, description, image, color = 0x915BFF, footer, fields }) {
      if (fields) return { color, title, description, fields, image: image ? { url: image } : null, footer: footer ? { text: footer } : null, timestamp: new Date().toISOString() };
      return { color, title, description, image: image ? { url: image } : null, footer: footer ? { text: footer } : null, timestamp: new Date().toISOString() };
    }

    function scq_updateLeaderboard(userId, right, wrong) {
      const r = SC_QUIZ_STATE.leaderboard[userId] ||= { acertos: 0, erros: 0, interacoes: 0, lastAt: 0 };
      r.acertos += right; r.erros += wrong;
      r.interacoes += (right + wrong);
      r.lastAt = Date.now();
      scq_save();
    }

    async function scq_clearCreatorsTrackedMessages(channel) {
      const ids = [...SC_QUIZ_STATE.creatorsCleanupMessageIds];
      SC_QUIZ_STATE.creatorsCleanupMessageIds = []; scq_save();
      for (const id of ids) {
        const m = await channel.messages.fetch(id).catch(() => null);
        if (m) await m.delete().catch(() => {});
      }
    }

    function scq_cancelAllActive() {
      SC_QUIZ_STATE.rt.active = null;
      SC_QUIZ_STATE.currentValidMessageId = null;
      SC_QUIZ_STATE.currentSatisfied = true;
      scq_save();
    }

    // === RANKING GRÁFICO ===
    async function scq_buildChartAttachment({ labels, data, title, color = 'rgb(145, 91, 255)' }) {
      const fill = color.replace('rgb', 'rgba').replace(')', ',0.7)');
      const cfg = {
        type: 'bar', data: { labels, datasets: [{ data, backgroundColor: fill, borderColor: color, borderWidth: 1, borderRadius: 8 }] },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: { display: false }, title: { display: true, text: title, color: '#fff' },
            datalabels: { color: '#fff', anchor: 'end', align: 'left' }
          },
          scales: { x: { grid: { color: 'rgba(255,255,255,0.1)' } }, y: { grid: { display: false } } }
        }
      };
      const res = await fetch('https://quickchart.io/chart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chart: cfg, width: 800, height: 400, backgroundColor: 'transparent' }) });
      return { attachment: Buffer.from(await res.arrayBuffer()), name: `chart_${Date.now()}.png` };
    }

    async function scq_renderRankingSticky() {
      try {
        const ch = await client.channels.fetch(SC_QUIZ_RANKING_CHANNEL_ID).catch(() => null);
        if (!ch) return;

        const entries = Object.entries(SC_QUIZ_STATE.leaderboard);
        const byAcertos = entries.slice().sort((a, b) => b[1].acertos - a[1].acertos).slice(0, 10);
        const byInter = entries.slice().sort((a, b) => b[1].interacoes - a[1].interacoes).slice(0, 10);

        const guild = ch.guild;

        async function buildLines(list) {
          return Promise.all(list.map(async ([uid, data], idx) => {
            const name = await scq_userDisplayNameSafe(guild, uid, `User ${uid}`);
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
            return `${medal} **${name}** — ✅ ${data.acertos} | 🔥 ${data.interacoes}`;
          }));
        }

        const labelsA = await Promise.all(byAcertos.map(e => scq_userDisplayNameSafe(guild, e[0], '...')));
        const labelsI = await Promise.all(byInter.map(e => scq_userDisplayNameSafe(guild, e[0], '...')));

        const chartA = await scq_buildChartAttachment({ labels: labelsA, data: byAcertos.map(e => e[1].acertos), title: 'Top Acertos', color: 'rgb(46, 204, 113)' });
        const chartI = await scq_buildChartAttachment({ labels: labelsI, data: byInter.map(e => e[1].interacoes), title: 'Top Interações', color: 'rgb(243, 156, 18)' });

        const embedA = scq_buildEmbed({
          title: '🏆 Ranking — Top Acertos',
          description: (await buildLines(byAcertos)).join('\n') || 'Ninguém pontuou ainda.',
          color: 0x2ECC71,
          footer: 'Atualizado em tempo real'
        });
        embedA.image = { url: `attachment://${chartA.name}` };

        const embedI = scq_buildEmbed({
          title: '🔥 Ranking — Top Interações',
          description: (await buildLines(byInter)).join('\n') || 'Sem interações ainda.',
          color: 0xF39C12,
          footer: 'Soma de acertos e erros'
        });
        embedI.image = { url: `attachment://${chartI.name}` };

        // --- Lógica Sticky para Ranking 1 (Acertos) ---
        if (SC_QUIZ_STATE.stickyRankingMsgIdAcertos) {
          const m = await ch.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdAcertos).catch(() => null);
          if (m) await m.edit({ embeds: [embedA], files: [chartA] });
          else {
            const sent = await ch.send({ embeds: [embedA], files: [chartA] });
            SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id;
          }
        } else {
          const sent = await ch.send({ embeds: [embedA], files: [chartA] });
          SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id;
        }

        // --- Lógica Sticky para Ranking 2 (Interações) ---
        if (SC_QUIZ_STATE.stickyRankingMsgIdInteracoes) {
          const m = await ch.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdInteracoes).catch(() => null);
          if (m) await m.edit({ embeds: [embedI], files: [chartI] });
          else {
            const sent = await ch.send({ embeds: [embedI], files: [chartI] });
            SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id;
          }
        } else {
          const sent = await ch.send({ embeds: [embedI], files: [chartI] });
          SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id;
        }

        scq_save();
      } catch (e) { console.error("[SC_QUIZ] Erro Ranking:", e); }
    }

    // === POSTAR QUIZ ===
    async function scq_postDailyQuiz(override = false) {
      if (!override && scq_hasActiveQuiz()) return;
      const ch = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
      const q = scq_getRandomQuestion();
      if (!ch || !q) return;
      await scq_clearCreatorsTrackedMessages(ch);
      const embed = scq_buildEmbed({ title: '🎯 QUIZ DIÁRIO', description: `**${q.texto}**\n\n${q.opcoes.join('\n')}`, image: GIF_QUIIZ_URL, footer: 'Responda por REPLY' });
      const msg = await ch.send({ content: `<@&${SC_MENTION_ROLES[0]}>`, embeds: [embed] });
      SC_QUIZ_STATE.currentValidMessageId = msg.id; SC_QUIZ_STATE.currentSatisfied = false;
      SC_QUIZ_STATE.activeQuizMessages = [{ id: msg.id, qid: q.id }];
      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
      scq_save();
    }

    async function sc_rt_postFastQuiz(override = false) {
      if (!override && scq_hasActiveQuiz()) return;
      const ch = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
      const q = scq_getRandomQuestion();
      if (!ch || !q) return;
      const embed = scq_buildEmbed({ title: '⚡ RELÂMPAGO!', description: `**${q.texto}**\n\n${q.opcoes.join('\n')}`, image: GIF_QUIIZ_URL });
      const msg = await ch.send({ content: `<@&${SC_MENTION_ROLES[0]}>`, embeds: [embed] });
      SC_QUIZ_STATE.rt.active = { messageId: msg.id, qid: q.id, correct: q.resposta };
      SC_QUIZ_STATE.currentValidMessageId = msg.id; SC_QUIZ_STATE.currentSatisfied = false;
      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
      scq_save();
    }

    // === HANDLERS ===
    async function handleAnswers(message) {
      const isFast = SC_QUIZ_STATE.rt.active?.messageId === (message.reference?.messageId || SC_QUIZ_STATE.currentValidMessageId);
      const qid = isFast ? SC_QUIZ_STATE.rt.active.qid : SC_QUIZ_STATE.activeQuizMessages[0]?.qid;
      const q = SC_QUIZ_BANK.find(x => x.id === qid);
      const ans = scq_pickAnswerLetter(message.content, q);
      if (!ans || scq_hasUserPlayedInRound(SC_QUIZ_STATE.currentValidMessageId, message.author.id)) return;

      SC_QUIZ_STATE.currentSatisfied = true;
      message.delete().catch(() => {});
      scq_markUserPlayedInRound(SC_QUIZ_STATE.currentValidMessageId, message.author.id, isFast ? 'fast' : 'daily');
      
      const correct = ans === (isFast ? SC_QUIZ_STATE.rt.active.correct : q.resposta);
      scq_updateLeaderboard(message.author.id, correct ? 1 : 0, correct ? 0 : 1);
      
      const feedback = await message.channel.send(`<@${message.author.id}>, resposta ${correct ? 'CORRETA ✅' : 'ERRADA ❌'}!`);
      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(feedback.id);
      scq_save();
      await scq_renderRankingSticky();

      if (!isFast && correct) {
        try {
          const dm = await message.author.createDM();
          await dm.send("Parabéns pelo acerto no diário! Fique atento às próximas.");
        } catch {}
      }
    }

    // === TICKER ===
    setInterval(async () => {
      const now = Date.now();
      if (SC_QUIZ_STATE.rt.nextFastAt <= now) {
        await sc_rt_postFastQuiz();
        SC_QUIZ_STATE.rt.nextFastAt = now + (SC_RT_EVERY_MINUTES * 60000);
        scq_save();
      }
    }, 30000);

    client.on('messageCreate', async (m) => {
      if (m.author.bot) return;
      if (m.channelId === SC_QUIZ_CREATORS_CHANNEL_ID) {
        if (m.content === '!quiznow') await scq_postDailyQuiz(true);
        else if (m.content === '!fastnow') await sc_rt_postFastQuiz(true);
        else await handleAnswers(m);
      }
    });

    console.log("[SC_QUIZ] Módulo pronto.");
  } catch (e) { console.error("[SC_QUIZ] Erro geral:", e); }
}