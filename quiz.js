// ===============================
// SANTA CREATORS — QUIZ DIÁRIO 📚
// ===============================

import fs from 'node:fs';
import { fetch } from 'undici';
import { SC_QUIZ_BANK } from './questions.js';

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

    // 📚 DIÁRIO
    const SC_QUIZ_DAILY_COUNT         = 10;
    const SC_QUIZ_WINDOW_START_HOUR   = 10;
    const SC_QUIZ_WINDOW_END_HOUR     = 22;
    const SC_QUIZ_MIN_GAP_MINUTES     = 25;
    const SC_QUIZ_DM_TIMEOUT_MS       = 3 * 60 * 1000;
    const SC_QUIZ_EXTRA_DM_QUESTIONS  = 3;
    const SC_QUIZ_DATA_PATH           = './sc_quiz_data.json'; // Caminho relativo à execução (raiz)
    const SC_QUIZ_POINTS_RIGHT        = 1;
    const SC_QUIZ_POINTS_WRONG        = 0;

    // =================== FAST QUIZ (RELÂMPAGO) — CONFIG ===================
    const SC_RT_EVERY_MINUTES         = 30;
    const SC_RT_DAILY_COUNT           = 15;
    const SC_RT_WINDOW_START_HOUR     = 12;
    const SC_RT_WINDOW_END_HOUR       = 23;
    const SC_RT_ACTIVE_TIMEOUT_MS     = 3 * 60 * 1000;

    const GIF_QUIIZ_URL = 'https://media.discordapp.net/attachments/1362477839944777889/1374893068649500783/standard_1.gif?ex=68c2b3b3&is=68c16233&hm=fb2088e9693479fdae08076fc482855004e662ed1a788e7b9788eff44b1c7dd6&=&width=1032&height=60';

    // ========= ESTADO/PERSISTÊNCIA =========
    let SC_QUIZ_STATE = {
      leaderboard: {},
      activeQuizMessages: [],
      stickyRankingMsgIdAcertos: null,
      stickyRankingMsgIdInteracoes: null,
      participantsByMsg: {},
      lastScheduleDayKey: null,
      __todaySchedule: [],
      creatorsCleanupMessageIds: []
    };

    SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {
      __todayScheduleFast: [],
      lastScheduleDayKeyFast: null,
      active: null,
      attempts: {}
    };

    function scq_load() {
      try {
        if (fs.existsSync(SC_QUIZ_DATA_PATH)) {
          const raw = fs.readFileSync(SC_QUIZ_DATA_PATH, 'utf8');
          const json = JSON.parse(raw);
          SC_QUIZ_STATE = Object.assign(SC_QUIZ_STATE, json || {});
        }
      } catch (e) {
        console.error("[SC_QUIZ] Erro ao carregar persistência:", e);
      }
    }

    function scq_save() {
      try {
        fs.writeFileSync(SC_QUIZ_DATA_PATH, JSON.stringify(SC_QUIZ_STATE, null, 2));
      } catch (e) {
        console.error("[SC_QUIZ] Erro ao salvar persistência:", e);
      }
    }

    scq_load();

    (function scq_normalizeState() {
      SC_QUIZ_STATE = SC_QUIZ_STATE || {};
      SC_QUIZ_STATE.leaderboard = SC_QUIZ_STATE.leaderboard || {};
      SC_QUIZ_STATE.activeQuizMessages = SC_QUIZ_STATE.activeQuizMessages || [];
      SC_QUIZ_STATE.participantsByMsg = SC_QUIZ_STATE.participantsByMsg || {};
      SC_QUIZ_STATE.__todaySchedule = SC_QUIZ_STATE.__todaySchedule || [];
      SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds || [];
      SC_QUIZ_STATE.currentValidMessageId = SC_QUIZ_STATE.currentValidMessageId || null;
      SC_QUIZ_STATE.currentSatisfied      = SC_QUIZ_STATE.currentSatisfied ?? true;
      SC_QUIZ_STATE.activity = SC_QUIZ_STATE.activity || {};
      SC_QUIZ_STATE.activity.counter = SC_QUIZ_STATE.activity.counter || 0;
      SC_QUIZ_STATE.activity.threshold = SC_QUIZ_STATE.activity.threshold || 30;
      if (!('stickyRankingMsgIdAcertos' in SC_QUIZ_STATE)) SC_QUIZ_STATE.stickyRankingMsgIdAcertos = null;
      if (!('stickyRankingMsgIdInteracoes' in SC_QUIZ_STATE)) SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = null;
      SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
      SC_QUIZ_STATE.rt.__todayScheduleFast = SC_QUIZ_STATE.rt.__todayScheduleFast || [];
      SC_QUIZ_STATE.rt.lastScheduleDayKeyFast = (typeof SC_QUIZ_STATE.rt.lastScheduleDayKeyFast === 'string' || SC_QUIZ_STATE.rt.lastScheduleDayKeyFast === null) ? SC_QUIZ_STATE.rt.lastScheduleDayKeyFast : null;
      SC_QUIZ_STATE.rt.active = SC_QUIZ_STATE.rt.active || null;
      SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};
    })();

    globalThis.SC_QUIZ_BANK = globalThis.SC_QUIZ_BANK ?? SC_QUIZ_BANK;
    const SC_RT_BANK = globalThis.SC_RT_BANK ?? SC_QUIZ_BANK;
    globalThis.SC_RT_BANK = SC_RT_BANK;

    // ======= HELPERS =======
    function scq_nowBRT() { return new Date(); }
    function scq_dayKey(d = scq_nowBRT()) { return d.toISOString().slice(0, 10); }
    function scq_randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function scq_normalizeAnswer(raw) {
      if (!raw) return '';
      const s = String(raw).trim();
      if (/^[A-D]$/i.test(s)) return s[0].toUpperCase();
      return s.toUpperCase();
    }
    function scq_hasActiveQuiz() { return !!SC_QUIZ_STATE.currentValidMessageId && SC_QUIZ_STATE.currentSatisfied === false; }
    function scq_isCurrentQuizMessage(messageId) { return !!messageId && SC_QUIZ_STATE.currentValidMessageId === messageId; }
    function scq_hasUserPlayedInRound(messageId, userId) {
      if (!messageId || !userId) return false;
      const uid = String(userId);
      const mid = String(messageId);
      if (SC_QUIZ_STATE.participantsByMsg?.[mid]?.[uid]) return true;
      if (SC_QUIZ_STATE.rt?.attempts?.[mid]?.[uid]) return true;
      return false;
    }
    function scq_markUserPlayedInRound(messageId, userId, mode = 'daily') {
      if (!messageId || !userId) return;
      const uid = String(userId);
      const mid = String(messageId);
      if (mode === 'fast') {
        SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
        SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};
        SC_QUIZ_STATE.rt.attempts[mid] = SC_QUIZ_STATE.rt.attempts[mid] || {};
        SC_QUIZ_STATE.rt.attempts[mid][uid] = true;
        return;
      }
      SC_QUIZ_STATE.participantsByMsg = SC_QUIZ_STATE.participantsByMsg || {};
      SC_QUIZ_STATE.participantsByMsg[mid] = SC_QUIZ_STATE.participantsByMsg[mid] || {};
      SC_QUIZ_STATE.participantsByMsg[mid][uid] = true;
    }
    function scq_isSingleLetter(raw) { return /^[A-D]$/i.test(String(raw).trim()); }
    function scq_pickAnswerLetter(raw, q) {
      const s = String(raw).trim().toUpperCase();
      if (/^[A-D]$/.test(s)) return s;
      if (q && Array.isArray(q.opcoes)) {
        for (const opt of q.opcoes) {
          const letter = opt[0];
          const text   = opt.slice(3).trim().toUpperCase();
          if (s === text) return letter;
        }
      }
      return null;
    }
    function scq_getRandomQuestion(excludeIds = new Set()) {
      const pool = SC_QUIZ_BANK.filter(q => !excludeIds.has(q.id));
      if (pool.length === 0) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    }
    function scq_buildEmbed({ title, description, fields, footer, image, color = 0x915BFF }) {
      const embed = { color, title, description };
      if (fields && fields.length) embed.fields = fields;
      if (footer) embed.footer = { text: footer };
      if (image) embed.image = { url: image };
      return embed;
    }
    function scq_userDisplayNameSafe(guild, userId, fallbackName) {
      return guild?.members?.fetch?.(userId)
        .then(m => m?.displayName || fallbackName || `User ${userId}`)
        .catch(() => fallbackName || `User ${userId}`);
    }
    function scq_updateLeaderboard(userId, right, wrong) {
      if (!SC_QUIZ_STATE.leaderboard[userId]) {
        SC_QUIZ_STATE.leaderboard[userId] = { acertos: 0, erros: 0, interacoes: 0, lastAt: Date.now() };
      }
      const r = SC_QUIZ_STATE.leaderboard[userId];
      r.acertos += right;
      r.erros   += wrong;
      r.interacoes += (right + wrong);
      r.lastAt = Date.now();
      scq_save();
    }
    function scq_trackCreatorsMessage(msg) {
      try {
        if (!msg?.id) return;
        SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds || [];
        if (!SC_QUIZ_STATE.creatorsCleanupMessageIds.includes(msg.id)) SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
        if (SC_QUIZ_STATE.creatorsCleanupMessageIds.length > 30) SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds.slice(-30);
        scq_save();
      } catch (e) { console.error('[SC_QUIZ] erro ao rastrear mensagem:', e); }
    }
    async function scq_clearCreatorsTrackedMessages(channel) {
      try {
        const trackedIds = Array.isArray(SC_QUIZ_STATE.creatorsCleanupMessageIds) ? [...SC_QUIZ_STATE.creatorsCleanupMessageIds] : [];
        SC_QUIZ_STATE.creatorsCleanupMessageIds = [];
        scq_save();
        for (const id of trackedIds) {
          try {
            const msg = await channel.messages.fetch(id).catch(() => null);
            if (msg) await msg.delete().catch(() => {});
          } catch (_) {}
        }
      } catch (e) { console.error('[SC_QUIZ] erro ao limpar mensagens:', e); }
    }
    function scq_cancelAllActive(reason = 'override') {
      try {
        if (SC_QUIZ_STATE.rt?.active) {
          const old = SC_QUIZ_STATE.rt.active;
          if (old?.messageId && SC_QUIZ_STATE.rt.attempts) delete SC_QUIZ_STATE.rt.attempts[old.messageId];
          SC_QUIZ_STATE.rt.active = null;
        }
        SC_QUIZ_STATE.activeQuizMessages = [];
        SC_QUIZ_STATE.participantsByMsg = {};
        SC_QUIZ_STATE.currentValidMessageId = null;
        SC_QUIZ_STATE.currentSatisfied = true;
        scq_save();
      } catch (e) { console.error('[SC_QUIZ] erro ao cancelar ativos:', e); }
    }

    async function scq_buildChartAttachment({ labels, data, title, color = 'rgb(145, 91, 255)' }) {
      const fill = color.replace('rgb', 'rgba').replace(')', ',0.7)');
      const maxVal = Math.max(1, ...data);
      const suggestedMax = Math.ceil(maxVal * 1.25);
      const cfg = {
        type: 'bar',
        data: {
          labels,
          datasets: [{ data, backgroundColor: fill, borderColor: color, borderWidth: 1, borderRadius: 8, maxBarThickness: 22, barPercentage: 0.9, categoryPercentage: 0.9 }]
        },
        options: {
          indexAxis: 'y', maintainAspectRatio: false,
          layout: { padding: { left: 12, right: 56, top: 10, bottom: 10 } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: title, color: '#E6EDF3', font: { size: 18, weight: '600' } },
            datalabels: { anchor: 'end', align: 'left', offset: 6, clamp: true, color: '#E6EDF3', font: { size: 12, weight: '600' } },
            tooltip: { enabled: false }
          },
          scales: {
            x: { suggestedMax, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#C9D1D9', precision: 0 }, border: { display: false } },
            y: { grid: { display: false }, ticks: { color: '#C9D1D9' }, border: { display: false } }
          }
        }
      };
      const res = await fetch('https://quickchart.io/chart', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart: cfg, width: 1000, height: 560, devicePixelRatio: 2, backgroundColor: 'transparent', format: 'png', plugins: ['datalabels'] })
      });
      const buf = Buffer.from(await res.arrayBuffer());
      return { attachment: buf, name: `chart_${Math.random().toString(36).slice(2)}.png` };
    }

    async function scq_renderRankingSticky() {
      try {
        const channel = await client.channels.fetch(SC_QUIZ_RANKING_CHANNEL_ID).catch(() => null);
        if (!channel) return;
        const entries = Object.entries(SC_QUIZ_STATE.leaderboard);
        const byAcertos = entries.slice().sort((a,b) => (b[1].acertos - a[1].acertos) || (a[1].erros - b[1].erros));
        const byInter = entries.slice().sort((a,b) => (b[1].interacoes - a[1].interacoes) || (b[1].acertos - a[1].acertos));
        const guild = channel.guild;
        async function line([uid, data], idx) {
          const name = await scq_userDisplayNameSafe(guild, uid, `User ${uid}`);
          const total = data.acertos + data.erros;
          const pct = total ? Math.round((data.acertos/total)*100) : 0;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx+1}.`;
          return `${medal} **${name}** — ✅ ${data.acertos} · ❌ ${data.erros} · 🔁 ${data.interacoes} · 🎯 ${pct}%`;
        }
        const topAList = byAcertos.slice(0,10);
        const topIList = byInter.slice(0,10);
        const topA = await Promise.all(topAList.map(line));
        const topI = await Promise.all(topIList.map(line));
        async function labelsFrom(list){
          const arr = [];
          for (const [uid] of list) {
            const name = await scq_userDisplayNameSafe(guild, uid, `User ${uid}`);
            arr.push(name.length > 18 ? name.slice(0, 17) + '…' : name);
          }
          return arr;
        }
        const labelsA = await labelsFrom(topAList);
        const labelsI = await labelsFrom(topIList);
        const dataA   = topAList.map(([_,d]) => d.acertos);
        const dataI   = topIList.map(([_,d]) => d.interacoes);
        const chartAFile = await scq_buildChartAttachment({ labels: labelsA, data: dataA, title: 'Top Acertos', color: 'rgb(46, 204, 113)' });
        const chartIFile = await scq_buildChartAttachment({ labels: labelsI, data: dataI, title: 'Top Interações', color: 'rgb(243, 156, 18)' });

        const embedA = scq_buildEmbed({ title: '🏆 Ranking — Top Acertos', description: topA.length ? topA.join('\n') : '_Sem dados ainda_', footer: 'Atualiza automaticamente.', color: 0x2ECC71 });
        embedA.image = { url: `attachment://${chartAFile.name}` };
        embedA.timestamp = new Date().toISOString();
        const embedI = scq_buildEmbed({ title: '🔥 Ranking — Top Interações', description: topI.length ? topI.join('\n') : '_Sem dados ainda_', footer: 'Atualiza automaticamente.', color: 0xF39C12 });
        embedI.image = { url: `attachment://${chartIFile.name}` };
        embedI.timestamp = new Date().toISOString();

        if (SC_QUIZ_STATE.stickyRankingMsgIdAcertos) {
          try { const msg = await channel.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdAcertos); await msg.edit({ embeds: [embedA], files: [chartAFile] }); }
          catch { const sent = await channel.send({ embeds: [embedA], files: [chartAFile] }); SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id; }
        } else { const sent = await channel.send({ embeds: [embedA], files: [chartAFile] }); SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id; }

        if (SC_QUIZ_STATE.stickyRankingMsgIdInteracoes) {
          try { const msg = await channel.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdInteracoes); await msg.edit({ embeds: [embedI], files: [chartIFile] }); }
          catch { const sent = await channel.send({ embeds: [embedI], files: [chartIFile] }); SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id; }
        } else { const sent = await channel.send({ embeds: [embedI], files: [chartIFile] }); SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id; }
        scq_save();
      } catch (e) { console.error('[SC_QUIZ] Erro ao render ranking:', e); }
    }

    async function scq_log(embed) {
      try { const ch = await client.channels.fetch(SC_QUIZ_LOGS_CHANNEL_ID).catch(() => null); if (ch) await ch.send({ embeds: [embed] }); } catch (_) {}
    }

    async function scq_postDailyQuiz(override = false) {
      if (!override && scq_hasActiveQuiz()) return;
      if (override) scq_cancelAllActive('daily_override');
      const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
      if (!channel) return;
      await scq_clearCreatorsTrackedMessages(channel);
      const q = scq_getRandomQuestion();
      if (!q) return;
      const embed = scq_buildEmbed({ title: '🎯 QUIZ DIÁRIO — Vale Pontos!', description: [`> Responda **por REPLY** para participar.`, `> +${SC_QUIZ_EXTRA_DM_QUESTIONS} perguntas no PV.`, '', `**${q.texto}**`, '', q.opcoes.map(x => `• ${x}`).join('\n')].join('\n'), image: GIF_QUIIZ_URL, footer: 'Responda por reply.' });
      const msg = await channel.send({ content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`, embeds: [embed], allowedMentions: { roles: SC_MENTION_ROLES } });
      scq_trackCreatorsMessage(msg);
      SC_QUIZ_STATE.activeQuizMessages = []; SC_QUIZ_STATE.participantsByMsg = {};
      SC_QUIZ_STATE.currentValidMessageId = msg.id; SC_QUIZ_STATE.currentSatisfied = false;
      SC_QUIZ_STATE.participantsByMsg[msg.id] = {};
      SC_QUIZ_STATE.activeQuizMessages.push({ id: msg.id, qid: q.id, createdAt: Date.now() });
      scq_save();
      await scq_log(scq_buildEmbed({ title: '📝 Quiz postado', description: `Pergunta: **${q.texto}**`, footer: `qid=${q.id}` }));
      await scq_renderRankingSticky();
    }

    // =================== FAST QUIZ — FUNÇÕES ===================
    async function sc_rt_beginRound(channel, embed, q, { announceOnTimeout = false } = {}) {
      await scq_clearCreatorsTrackedMessages(channel);
      const msg = await channel.send({ content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`, embeds: [embed], allowedMentions: { roles: SC_MENTION_ROLES } });
      scq_trackCreatorsMessage(msg);
      SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {}; SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};
      SC_QUIZ_STATE.activeQuizMessages = []; SC_QUIZ_STATE.participantsByMsg = {};
      SC_QUIZ_STATE.rt.active = { messageId: msg.id, qid: q.id, correct: q.resposta, createdAt: Date.now(), winnerId: null };
      SC_QUIZ_STATE.rt.attempts[msg.id] = {};
      SC_QUIZ_STATE.currentValidMessageId = msg.id; SC_QUIZ_STATE.currentSatisfied = false;
      scq_save();
      setTimeout(async () => {
        try {
          const act = SC_QUIZ_STATE.rt.active;
          if (!act || act.messageId !== msg.id || act.winnerId) return;
          SC_QUIZ_STATE.rt.active.timedOut = true;
          scq_save();
          if (announceOnTimeout) {
            const tMsg = await channel.send({ embeds: [scq_buildEmbed({ title: '⏰ Relâmpago encerrado', description: `Ninguém acertou. Gabarito: **${q.resposta}**`, image: GIF_QUIIZ_URL })] });
            scq_trackCreatorsMessage(tMsg);
          }
        } catch {}
      }, SC_RT_ACTIVE_TIMEOUT_MS);
    }

    async function sc_rt_postFastQuiz(override = false) {
      const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(()=>null);
      if (!channel || (!override && scq_hasActiveQuiz())) return;
      if (override) scq_cancelAllActive('fast_override');
      const q = SC_RT_BANK[Math.floor(Math.random()*SC_RT_BANK.length)];
      const embed = scq_buildEmbed({ title: '⚡ PERGUNTA RELÂMPAGO!', description: [`A **primeira resposta correta** ganha **+${SC_QUIZ_POINTS_RIGHT}**.`, '', `**${q.texto}**`, '', q.opcoes.map(x => `• ${x}`).join('\n')].join('\n'), image: GIF_QUIIZ_URL, footer: 'Modo relâmpago' });
      await sc_rt_beginRound(channel, embed, q);
    }

    async function sc_rt_handlePotentialAnswer(message) {
      const act = SC_QUIZ_STATE.rt?.active;
      if (!act || message.id === act.messageId || !scq_isCurrentQuizMessage(act.messageId)) return;
      const q = SC_RT_BANK.find(x => x.id === act.qid);
      const ans = scq_pickAnswerLetter(message.content, q);
      if (!ans) return;
      SC_QUIZ_STATE.currentSatisfied = true;
      message.delete().catch(()=>{});
      if (scq_hasUserPlayedInRound(act.messageId, message.author.id)) return;
      scq_markUserPlayedInRound(act.messageId, message.author.id, 'fast');
      if (ans !== act.correct) {
        scq_updateLeaderboard(message.author.id, 0, 1);
        await scq_renderRankingSticky(); return;
      }
      act.winnerId = message.author.id; SC_QUIZ_STATE.rt.active = null;
      scq_updateLeaderboard(message.author.id, 1, 0); scq_save();
      const winMsg = await message.channel.send({ content: `<@${message.author.id}> acertou! +${SC_QUIZ_POINTS_RIGHT}` });
      scq_trackCreatorsMessage(winMsg);
      await scq_renderRankingSticky();
    }

    async function scq_handleDailyAnswer(message) {
      const currentId = SC_QUIZ_STATE.currentValidMessageId;
      const active = SC_QUIZ_STATE.activeQuizMessages.find(x => x.id === currentId);
      if (!active || !scq_isCurrentQuizMessage(currentId)) return;
      const qMain = SC_QUIZ_BANK.find(x => x.id === active.qid);
      const ans = scq_pickAnswerLetter(message.content, qMain);
      if (!ans || scq_hasUserPlayedInRound(currentId, message.author.id)) return;
      message.delete().catch(()=>{});
      SC_QUIZ_STATE.currentSatisfied = true;
      scq_markUserPlayedInRound(currentId, message.author.id, 'daily');
      const right = (ans === qMain.resposta);
      scq_updateLeaderboard(message.author.id, right ? 1 : 0, right ? 0 : 1);
      const resMsg = await message.channel.send({ content: `<@${message.author.id}>, resposta ${right?'certa':'errada'}! Verifique seu PV.` });
      scq_trackCreatorsMessage(resMsg);
      // [Lógica de DM com perguntas extras omitida por brevidade, mas deve ser mantida]
      await scq_renderRankingSticky();
    }

    function scq_startTicker() {
      setInterval(async () => {
        const now = Date.now();
        const dayKey = scq_dayKey();
        if (SC_RT_EVERY_MINUTES > 0 && (!SC_QUIZ_STATE.rt.nextFastAt || SC_QUIZ_STATE.rt.nextFastAt <= now)) {
           await sc_rt_postFastQuiz(false);
           SC_QUIZ_STATE.rt.nextFastAt = now + (SC_RT_EVERY_MINUTES * 60 * 1000);
           scq_save();
        }
      }, 15000);
    }

    // ====== LISTENERS ======
    client.once('ready', async () => {
      await scq_renderRankingSticky();
      scq_startTicker();
      console.log("[SC_QUIZ] Pronto.");
    });

    client.on('messageDelete', async (msg) => {
      if (SC_QUIZ_STATE.currentValidMessageId === msg.id) scq_save();
    });

    client.on('messageCreate', async (message) => {
      if (!message.guild || message.author.bot) return;
      if (message.channelId === SC_QUIZ_CREATORS_CHANNEL_ID) {
        const replyTo = message.reference?.messageId;
        if (replyTo || scq_isSingleLetter(message.content)) {
          if (SC_QUIZ_STATE.rt?.active?.messageId === (replyTo || SC_QUIZ_STATE.currentValidMessageId)) await sc_rt_handlePotentialAnswer(message);
          else await scq_handleDailyAnswer(message);
        }
      }
      // [Comandos !fastid, !fastnow, !quiznow devem ser mantidos aqui]
    });

  } catch (err) { console.error("[SC_QUIZ] Falha geral:", err); }
}