// ===============================
// SANTA CREATORS — QUIZ DIÁRIO 📚
// ===============================
// • Posta 1 quiz/dia em horário aleatório no canal Creators.
// • Quem responder por REPLY tem a resposta apagada e recebe +3 perguntas no PV.
// • 3 min por pergunta no PV (timeout encerra a rodada).
// • Ranking público (acertos, erros, interações) com sticky message.
// • Logs detalhados em canal próprio (quem responder, certo/errado, etc.).

import fs from 'node:fs';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from 'discord.js';
import { SC_QUIZ_BANK } from './questions.js';

export async function setupQuiz(client) {
  try {
    if (client.__SC_QUIZ_INSTALLED) return;
    client.__SC_QUIZ_INSTALLED = true;

    // Node < 18 polyfill fetch
    if (typeof fetch === 'undefined') {
      const { fetch: undiciFetch } = await import('undici');
      globalThis.fetch = undiciFetch;
    }

    // ========== CONFIGURAÇÕES ==========
    const SC_QUIZ_CREATORS_CHANNEL_ID = '1381597720007151698'; // Canal do quiz
    const SC_QUIZ_RANKING_CHANNEL_ID  = '1495330319715532880'; // Canal do ranking
    const SC_QUIZ_LOGS_CHANNEL_ID     = '1415390219779313808'; // Canal de logs
    const SC_MENTION_ROLES = ['1262978759922028575', '1352275728476930099'];

    // IDs autorizados para resetar o ranking
    const SC_AUTHORIZED_RESET_IDS = ['660311795327828008', '1262262852949905408', '1352408327983861844'];

    const SC_QUIZ_TOTAL_PER_DAY      = 20; // Quantidade de quizzes aleatórios por dia
    const SC_QUIZ_WINDOW_START_HOUR  = 0;  // 00:00 (24 horas)
    const SC_QUIZ_WINDOW_END_HOUR    = 23; // 23:59 (24 horas)
    const SC_QUIZ_MIN_GAP_MINUTES    = 25;
    const SC_QUIZ_DM_TIMEOUT_MS      = 3 * 60 * 1000;
    const SC_QUIZ_EXTRA_DM_QUESTIONS = 3;
    const SC_QUIZ_DATA_PATH          = './sc_quiz_data.json';
    const SC_QUIZ_POINTS_RIGHT       = 1;

    const SC_RT_EVERY_MINUTES        = 30; // Frequência do relâmpago
    const SC_RT_WINDOW_START_HOUR    = 12;
    const SC_RT_WINDOW_END_HOUR      = 23;
    const SC_RT_ACTIVE_TIMEOUT_MS    = 3 * 60 * 1000;

    const GIF_QUIIZ_URL = 'https://media.discordapp.net/attachments/1362477839944777889/1374893068649500783/standard_1.gif?ex=68c2b3b3&is=68c16233&hm=fb2088e9693479fdae08076fc482855004e662ed1a788e7b9788eff44b1c7dd6&=&width=1032&height=60';
    const SC_RT_BANK = SC_QUIZ_BANK; // Usa o mesmo banco de perguntas

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
      activity: { counter: 0, threshold: 30 },
      rt: { __todayScheduleFast: [], active: null, attempts: {}, lastWinnerId: null, lastFastMsgId: null }
    };

    // ======= PERSISTÊNCIA =======
    function scq_load() {
      try {
        if (fs.existsSync(SC_QUIZ_DATA_PATH)) {
          const raw = fs.readFileSync(SC_QUIZ_DATA_PATH, 'utf8');
          const json = JSON.parse(raw);
          SC_QUIZ_STATE = Object.assign(SC_QUIZ_STATE, json || {});
        }
      } catch (e) { console.error("[SC_QUIZ] Erro carregar dados:", e); }
    }
    function scq_save() {
  try {
    const tmpPath = SC_QUIZ_DATA_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(SC_QUIZ_STATE, null, 2));
    fs.renameSync(tmpPath, SC_QUIZ_DATA_PATH);
  } catch (e) {
    console.error("[SC_QUIZ] Erro salvar dados:", e);
  }
}
    scq_load();

    function scq_getFreshState() {
      return {
        leaderboard: {},
        participantsByMsg: {},
        activeQuizMessages: [],
        creatorsCleanupMessageIds: [],
        currentValidMessageId: null,
        currentSatisfied: true,
        activity: { counter: 0, threshold: 30 },
        rt: {
          __todayScheduleFast: [],
          lastScheduleDayKeyFast: null,
          active: null,
          attempts: {},
          lastWinnerId: null,
          lastFastMsgId: null,
          lastRtAt: 0,
          nextFastAt: 0
        },
        lastScheduleDayKey: null,
        __todaySchedule: [],
        // Mantém apenas os IDs das mensagens fixas para não perder o canal
        stickyRankingMsgIdAcertos: SC_QUIZ_STATE.stickyRankingMsgIdAcertos || null,
        stickyRankingMsgIdInteracoes: SC_QUIZ_STATE.stickyRankingMsgIdInteracoes || null,
      };
    }

    async function scq_resetEntireQuizState(reason) {
      console.log(`[SC_QUIZ] Reset total acionado por: ${reason}`);
      SC_QUIZ_STATE = scq_getFreshState();
      scq_save();
    }

    // ======= HELPERS =======
    function scq_nowBRT() { return new Date(); }
    function scq_dayKey(d = scq_nowBRT()) { return d.toISOString().slice(0, 10); }
    function scq_randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function scq_hasActiveQuiz() {
      return !!SC_QUIZ_STATE.currentValidMessageId && SC_QUIZ_STATE.currentSatisfied === false;
    }
    function scq_isCurrentQuizMessage(messageId) {
      return !!messageId && SC_QUIZ_STATE.currentValidMessageId === messageId;
    }
    function scq_hasUserPlayedInRound(messageId, userId) {
      if (SC_QUIZ_STATE.participantsByMsg?.[messageId]?.[userId]) return true;
      if (SC_QUIZ_STATE.rt?.attempts?.[messageId]?.[userId]) return true;
      return false;
    }
    function scq_markUserPlayedInRound(messageId, userId, mode = 'daily') {
      if (mode === 'fast') {
        SC_QUIZ_STATE.rt.attempts[messageId] ||= {};
        SC_QUIZ_STATE.rt.attempts[messageId][userId] = true;
      } else {
        SC_QUIZ_STATE.participantsByMsg[messageId] ||= {};
        SC_QUIZ_STATE.participantsByMsg[messageId][userId] = true;
      }
    }
    function scq_isSingleLetter(raw) {
      return /^[A-D]$/i.test(String(raw).trim());
    }
    function scq_normalizeAnswer(raw) {
      const s = String(raw || '').trim().toUpperCase();
      return /^[A-D]$/.test(s) ? s : s;
    }
    function scq_pickAnswerLetter(raw, q) {
      const s = String(raw).trim().toUpperCase();
      if (/^[A-D]$/.test(s)) return s;
      if (q?.opcoes) {
        for (const opt of q.opcoes) {
          const letter = opt[0];
          const text = opt.slice(3).trim().toUpperCase();
          if (s === text) return letter;
        }
      }
      return null;
    }
    function scq_getRandomQuestion(exclude = new Set()) {
      const pool = SC_QUIZ_BANK.filter(q => !exclude.has(q.id));
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }
    function scq_buildEmbed({ title, description, image, color = 0x915BFF, footer, thumbnail }) {
      return {
        color, title, description,
        image: image ? { url: image } : null,
        thumbnail: thumbnail ? { url: thumbnail } : null,
        footer: footer ? { text: footer } : null,
        timestamp: new Date().toISOString()
      };
    }
    async function scq_userDisplayNameSafe(guild, userId, fallbackName) {
      try {
        const m = await guild.members.fetch(userId);
        return m?.displayName || fallbackName;
      } catch { return fallbackName; }
    }
    function scq_updateLeaderboard(userId, right, wrong) {
      const r = SC_QUIZ_STATE.leaderboard[userId] ||= { acertos: 0, erros: 0, interacoes: 0, lastAt: 0 };
      r.acertos += right;
      r.erros += wrong;
      r.interacoes += (right + wrong);
      r.lastAt = Date.now();
      scq_save();
    }
    async function scq_log(embed) {
      const ch = await client.channels.fetch(SC_QUIZ_LOGS_CHANNEL_ID).catch(() => null);
      if (ch) await ch.send({ embeds: [embed] }).catch(() => {});
    }
    async function scq_clearCreatorsTrackedMessages(channel) {
  try {
    const trackedIds = Array.isArray(SC_QUIZ_STATE.creatorsCleanupMessageIds)
      ? [...SC_QUIZ_STATE.creatorsCleanupMessageIds]
      : [];

    const idsToDelete = new Set(trackedIds);

    SC_QUIZ_STATE.creatorsCleanupMessageIds = [];
    scq_save();

    for (const id of trackedIds) {
      const m = await channel.messages.fetch(id).catch(() => null);
      if (m) await m.delete().catch(() => {});
    }

    const recent = await channel.messages.fetch({ limit: 100 }).catch(() => null);
    if (!recent) return;

    const shouldDeleteQuizMessage = (msg) => {
      if (!msg || msg.author?.id !== client.user?.id) return false;
      if (idsToDelete.has(msg.id)) return false;

      const embed = msg.embeds?.[0] || null;
      const title = String(embed?.title || '').toLowerCase();
      const footer = String(embed?.footer?.text || '').toLowerCase();
      const desc = String(embed?.description || '').toLowerCase();
      const content = String(msg.content || '').toLowerCase();

      const text = `${title}\n${footer}\n${desc}\n${content}`;

      return (
        text.includes('quiz diário') ||
        text.includes('pergunta relâmpago') ||
        text.includes('relâmpago manual') ||
        text.includes('modo relâmpago') ||
        text.includes('resposta correta') ||
        text.includes('resposta incorreta') ||
        text.includes('vencedor') ||
        text.includes('você já participou desta rodada') ||
        text.includes('errou! próxima tentativa livre')
      );
    };

    for (const msg of recent.values()) {
      if (shouldDeleteQuizMessage(msg)) {
        await msg.delete().catch(() => {});
      }
    }
  } catch (e) {
    console.error('[SC_QUIZ] erro ao limpar mensagens antigas:', e);
  }
}
    function scq_cancelAllActive(reason = 'override') {
  SC_QUIZ_STATE.rt.active = null;
  SC_QUIZ_STATE.activeQuizMessages = [];
  SC_QUIZ_STATE.currentValidMessageId = null;
  SC_QUIZ_STATE.currentSatisfied = true;
  scq_save();
  console.log(`[SC_QUIZ] Cancelado: ${reason}`);
}

async function scq_finalizeRound(channel, messageId) {
  try {
    if (!channel || !messageId) return;

    SC_QUIZ_STATE.rt.active = null;
    SC_QUIZ_STATE.currentValidMessageId = null;
    SC_QUIZ_STATE.currentSatisfied = true;
    SC_QUIZ_STATE.activeQuizMessages = (SC_QUIZ_STATE.activeQuizMessages || []).filter(x => x.id !== messageId);

    if (SC_QUIZ_STATE.participantsByMsg?.[messageId]) {
      delete SC_QUIZ_STATE.participantsByMsg[messageId];
    }

    if (SC_QUIZ_STATE.rt?.attempts?.[messageId]) {
      delete SC_QUIZ_STATE.rt.attempts[messageId];
    }

    SC_QUIZ_STATE.creatorsCleanupMessageIds = (SC_QUIZ_STATE.creatorsCleanupMessageIds || []).filter(id => id !== messageId);

    scq_save();
  } catch (e) {
    console.error('[SC_QUIZ] erro ao finalizar rodada:', e);
  }
}

// ======= RANKING GRÁFICO =======
async function scq_buildChartAttachment({ labels, data, title, color = 'rgb(145, 91, 255)' }) {
      const fill = color.replace('rgb', 'rgba').replace(')', ',0.7)');
      const cfg = {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: fill, borderColor: color, borderWidth: 1, borderRadius: 8 }] },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            title: { display: true, text: title, color: '#E6EDF3' },
            datalabels: { anchor: 'end', align: 'left', color: '#fff' }
          },
          scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' } }, y: { grid: { display: false } } }
        }
      };
      const res = await fetch('https://quickchart.io/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart: cfg, width: 800, height: 450, backgroundColor: 'transparent', plugins: ['datalabels'] })
      });
      const buf = Buffer.from(await res.arrayBuffer());
      return { attachment: buf, name: `chart_${Math.random().toString(36).slice(2)}.png` };
    }
    async function scq_renderRankingSticky() {
      try {
        const channel = await client.channels.fetch(SC_QUIZ_RANKING_CHANNEL_ID).catch(() => null);
        if (!channel) return;
        const entries = Object.entries(SC_QUIZ_STATE.leaderboard);
        const byA = entries.sort((a,b) => b[1].acertos - a[1].acertos).slice(0, 10);
        const byI = entries.sort((a,b) => b[1].interacoes - a[1].interacoes).slice(0, 10);

        const labelsA = await Promise.all(byA.map(e => scq_userDisplayNameSafe(channel.guild, e[0], '...')));
        const labelsI = await Promise.all(byI.map(e => scq_userDisplayNameSafe(channel.guild, e[0], '...')));

        const chartA = await scq_buildChartAttachment({ labels: labelsA, data: byA.map(e => e[1].acertos), title: 'Top Acertos', color: 'rgb(46, 204, 113)' });
        const chartI = await scq_buildChartAttachment({ labels: labelsI, data: byI.map(e => e[1].interacoes), title: 'Top Interações', color: 'rgb(243, 156, 18)' });

        const descA = (await Promise.all(byA.map(async ([uid, d], i) => {
          const name = await scq_userDisplayNameSafe(channel.guild, uid, uid);
          const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}.`;
          return `${medal} **${name}** — ✅ ${d.acertos} | 🔥 ${d.interacoes}`;
        }))).join('\n') || '_Sem dados_';

        const embedA = scq_buildEmbed({ title: '🏆 Ranking — Top Acertos', description: descA, color: 0x2ECC71 });
        embedA.image = { url: `attachment://${chartA.name}` };
        const embedI = scq_buildEmbed({ title: '🔥 Ranking — Top Interações', description: 'Atualizado em tempo real.', color: 0xF39C12 });
        embedI.image = { url: `attachment://${chartI.name}` };

        const resetRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('scq_reset_ranking_btn')
            .setLabel('Resetar Ranking')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🧹')
        );

        // Busca inteligente no canal para evitar duplicação
        const findRankingMsg = async (id, titlePart) => {
          let m = id ? await channel.messages.fetch(id).catch(() => null) : null;
          if (!m) {
            const msgs = await channel.messages.fetch({ limit: 50 }).catch(() => null);
            m = msgs?.find(msg => msg.author.id === client.user.id && msg.embeds[0]?.title?.includes(titlePart));
          }
          return m;
        };

        const msgA = await findRankingMsg(SC_QUIZ_STATE.stickyRankingMsgIdAcertos, 'Top Acertos');
        if (msgA) {
          await msgA.edit({ embeds: [embedA], files: [chartA] }).catch(() => null);
          SC_QUIZ_STATE.stickyRankingMsgIdAcertos = msgA.id;
        } else SC_QUIZ_STATE.stickyRankingMsgIdAcertos = (await channel.send({ embeds: [embedA], files: [chartA] })).id;

        const msgI = await findRankingMsg(SC_QUIZ_STATE.stickyRankingMsgIdInteracoes, 'Top Interações');
        if (msgI) {
          await msgI.edit({ embeds: [embedI], files: [chartI], components: [resetRow] }).catch(() => null);
          SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = msgI.id;
        } else SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = (await channel.send({ embeds: [embedI], files: [chartI], components: [resetRow] })).id;

        scq_save();
      } catch (e) { console.error("[SC_QUIZ] Erro Ranking:", e); }
    }

    // ======= CORE: POSTAR QUIZ =======
    async function scq_postDailyQuiz(override = false) {
      if (!override && scq_hasActiveQuiz()) return;
      if (override) scq_cancelAllActive('daily_override');
      const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
      const q = scq_getRandomQuestion();
      if (!channel || !q) return;
      await scq_clearCreatorsTrackedMessages(channel);

      const embed = scq_buildEmbed({
        title: '🎯 QUIZ DIÁRIO — Vale Pontos!',
        description: [
          `> Responda **por REPLY** para participar.`,
          `> +**${SC_QUIZ_EXTRA_DM_QUESTIONS}** perguntas no PV para quem interagir.`,
          '',
          `**${q.texto}**`,
          '',
          q.opcoes.map(x => `• ${x}`).join('\n')
        ].join('\n'),
        image: GIF_QUIIZ_URL,
        footer: 'Responda por reply nesta mensagem.'
      });

      const msg = await channel.send({
        content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`,
        embeds: [embed],
        allowedMentions: { roles: SC_MENTION_ROLES }
      });

      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
      SC_QUIZ_STATE.currentValidMessageId = msg.id;
      SC_QUIZ_STATE.currentSatisfied = false;
      SC_QUIZ_STATE.activeQuizMessages = [{ id: msg.id, qid: q.id, createdAt: Date.now() }];
      scq_save();
      await scq_renderRankingSticky();
    }

    async function sc_rt_postFastQuiz(override = false) {
      if (!override && scq_hasActiveQuiz()) return;
      if (override) scq_cancelAllActive('fast_override');
      const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
      const q = scq_getRandomQuestion();
      if (!channel || !q) return;
      await scq_clearCreatorsTrackedMessages(channel);

      const embed = scq_buildEmbed({
        title: '⚡ PERGUNTA RELÂMPAGO!',
        description: [
          `O primeiro que acertar **A/B/C/D** aqui no chat ganha o ponto!`,
          '',
          `**${q.texto}**`,
          '',
          q.opcoes.map(x => `• ${x}`).join('\n')
        ].join('\n'),
        image: GIF_QUIIZ_URL,
        footer: 'Modo relâmpago'
      });

      const msg = await channel.send({
        content: `<@&${SC_MENTION_ROLES[0]}>`,
        embeds: [embed],
        allowedMentions: { roles: SC_MENTION_ROLES }
      });

      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
      SC_QUIZ_STATE.rt.active = { 
        messageId: msg.id, 
        qid: q.id, 
        correct: q.resposta,
        correctText: q.opcoes.find(o => o.startsWith(`${q.resposta})`)) || null,
        createdAt: Date.now() 
      };
      SC_QUIZ_STATE.rt.attempts[msg.id] = {};
      SC_QUIZ_STATE.rt.lastFastMsgId = msg.id;
      SC_QUIZ_STATE.rt.lastWinnerId = null;
      SC_QUIZ_STATE.currentValidMessageId = msg.id;
      SC_QUIZ_STATE.currentSatisfied = false;
      scq_save();
    }

    // ======= HANDLERS: RESPOSTAS =======
    async function handleQuizAnswer(message) {
      const currentId = SC_QUIZ_STATE.currentValidMessageId;
      if (!currentId || message.author.bot) return;

      const isFastRound = SC_QUIZ_STATE.rt.lastFastMsgId === currentId;
      const isFastStillActive = SC_QUIZ_STATE.rt.active?.messageId === currentId;

      if (isFastRound && !isFastStillActive && SC_QUIZ_STATE.rt.lastWinnerId && scq_isSingleLetter(message.content)) {
  const lateUserMsg = message;
  const winner = await message.guild.members.fetch(SC_QUIZ_STATE.rt.lastWinnerId).catch(() => null);

  const warnMsg = await message.channel.send({
    content: `❌ <@${message.author.id}>, esse quiz já foi respondido!`,
    embeds: [scq_buildEmbed({
      title: '⌛ Quiz Encerrado',
      description: `Infelizmente você chegou um pouco tarde. **${winner?.displayName || 'Alguém'}** já acertou!\n\nFica de olho que daqui a pouco tem mais um 👀`,
      thumbnail: winner?.user?.displayAvatarURL?.() || null,
      color: 0xF39C12
    })],
    allowedMentions: { users: [message.author.id] }
  }).catch(() => null);

  setTimeout(async () => {
    await lateUserMsg.delete().catch(() => {});
    if (warnMsg) await warnMsg.delete().catch(() => {});
  }, 8000);

  return;
}

      // ⛔ Garante que a interação no antigo pare de funcionar
      if (message.reference?.messageId && message.reference.messageId !== currentId) return;

      const isFast = SC_QUIZ_STATE.rt.active?.messageId === currentId;
      const act = isFast ? SC_QUIZ_STATE.rt.active : null;
      const activeDaily = SC_QUIZ_STATE.activeQuizMessages.find(x => x.id === currentId);
      const qid = isFast ? act.qid : activeDaily?.qid;
      const q = SC_QUIZ_BANK.find(x => x.id === qid);
      if (!q) return;

      const expected = String(isFast ? (act.correct || q.resposta) : q.resposta).trim().toUpperCase();
      const ans = scq_pickAnswerLetter(message.content, q);

      if (ans) {
        console.log('[SC_QUIZ_DEBUG]', { qid: q.id, ans, expected, isFast });
      }

      if (!ans) return;

      // Já participou?
      if (scq_hasUserPlayedInRound(currentId, message.author.id)) {
        message.delete().catch(() => {});
        return message.channel.send(`<@${message.author.id}>, você já participou desta rodada!`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      }

      message.delete().catch(() => {});
scq_markUserPlayedInRound(currentId, message.author.id, isFast ? 'fast' : 'daily');

const right = ans === expected;

console.log('[SC_QUIZ_DEBUG]', {
  qid: q.id,
  pergunta: q.texto,
  opcoes: q.opcoes,
  respostaRecebida: message.content,
  ans,
  expected,
  activeCorrect: SC_QUIZ_STATE.rt.active?.correct,
  bankCorrect: q.resposta,
  isFast
});

scq_updateLeaderboard(message.author.id, right ? 1 : 0, right ? 0 : 1);

      if (isFast) {
        if (right) {
  SC_QUIZ_STATE.rt.active = null;
  SC_QUIZ_STATE.rt.lastWinnerId = message.author.id;

  // Mantém bloqueado por 5 minutos para não nascer outro quiz por cima
  SC_QUIZ_STATE.currentSatisfied = false;

  const winMsg = await message.channel.send({
    embeds: [scq_buildEmbed({
      title: '🏁 Vencedor!',
      description: `<@${message.author.id}> acertou primeiro! +${SC_QUIZ_POINTS_RIGHT}\n\n🧹 Esta pergunta será limpa automaticamente em **5 minutos**.`,
      color: 0x2ECC71,
      thumbnail: message.author.displayAvatarURL()
    })],
    allowedMentions: { users: [message.author.id] }
  });

  SC_QUIZ_STATE.creatorsCleanupMessageIds.push(winMsg.id);
  scq_save();

  await scq_renderRankingSticky();

  setTimeout(async () => {
    try {
      const quizMsg = await message.channel.messages.fetch(currentId).catch(() => null);
      if (quizMsg) await quizMsg.delete().catch(() => {});

      const winnerMsg = await message.channel.messages.fetch(winMsg.id).catch(() => null);
      if (winnerMsg) await winnerMsg.delete().catch(() => {});

      SC_QUIZ_STATE.currentValidMessageId = null;
      SC_QUIZ_STATE.currentSatisfied = true;
      SC_QUIZ_STATE.activeQuizMessages = [];
      SC_QUIZ_STATE.creatorsCleanupMessageIds = (SC_QUIZ_STATE.creatorsCleanupMessageIds || [])
        .filter(id => id !== currentId && id !== winMsg.id);

      scq_save();

      await scq_clearCreatorsTrackedMessages(message.channel);
    } catch (e) {
      console.error('[SC_QUIZ] erro ao limpar relâmpago após vencedor:', e);
    }
  }, 5 * 60 * 1000);
} else {
  const errMsg = await message.channel.send({
    content: `💔 Poxa, <@${message.author.id}>...`,
    embeds: [scq_buildEmbed({
      title: '❌ Resposta Incorreta',
      description: 'Você errou no chat, mas a rodada continua até alguém acertar! 💪',
      color: 0xE74C3C,
      thumbnail: message.author.displayAvatarURL()
    })]
  });

  SC_QUIZ_STATE.creatorsCleanupMessageIds.push(errMsg.id);
  scq_save();
}
      } else {
        // Fluxo Diário + DM
        const resMsg = await message.channel.send({ 
          content: right ? `🌟 Mandou bem, <@${message.author.id}>!` : `💔 Poxa, <@${message.author.id}>...`,
          embeds: [scq_buildEmbed({ 
            title: right ? '✅ Resposta Correta!' : '❌ Resposta Incorreta', 
            description: right 
              ? 'Você acertou no chat! Agora termine o desafio que te enviei no PV. 🚀' 
              : 'Você errou no chat, mas não desanime! Ainda pode recuperar pontuando nas perguntas que te mandei no PV! 💪', 
            color: right ? 0x2ECC71 : 0xE74C3C,
            thumbnail: message.author.displayAvatarURL()
          })] 
        });
        SC_QUIZ_STATE.creatorsCleanupMessageIds.push(resMsg.id);
        scq_save();
        await scq_renderRankingSticky();
        await runDMExtras(message.author, q.id, right);
        await scq_finalizeRound(message.channel, currentId);
      }
    }

    async function runDMExtras(user, mainQid, mainRight) {
      let dm;
      try { dm = await user.createDM(); } catch { return; }

      await dm.send({ embeds: [scq_buildEmbed({ title: '📥 QUIZ — Extras', description: `Você tem **3 minutos** por pergunta. Responda **A/B/C/D**. Boa sorte!` })] });

      const used = new Set([mainQid]);
      let r = 0, w = 0;

      for (let i = 0; i < SC_QUIZ_EXTRA_DM_QUESTIONS; i++) {
        const q = scq_getRandomQuestion(used);
        if (!q) break;
        used.add(q.id);

        await dm.send({ embeds: [scq_buildEmbed({ title: `Pergunta ${i + 1}/${SC_QUIZ_EXTRA_DM_QUESTIONS}`, description: `**${q.texto}**\n\n${q.opcoes.join('\n')}` })] });

        const collected = await dm.awaitMessages({ filter: m => !m.author.bot, max: 1, time: SC_QUIZ_DM_TIMEOUT_MS }).catch(() => null);
        if (!collected?.first()) {
          await dm.send("⏰ Tempo esgotado.");
          scq_updateLeaderboard(user.id, 0, 1); w++; break;
        }

        const ans = scq_normalizeAnswer(collected.first().content);
        const hit = (ans === q.resposta || collected.first().content.toUpperCase().includes(q.opcoes.find(o=>o.startsWith(q.resposta))?.slice(3).toUpperCase()));

        if (hit) { r++; scq_updateLeaderboard(user.id, 1, 0); await dm.send("✅ Correto!"); }
        else { w++; scq_updateLeaderboard(user.id, 0, 1); await dm.send(`❌ Errou! Gabarito: **${q.resposta}**`); }
        
        await scq_log(scq_buildEmbed({ title: hit ? '✅ Acerto PV' : '❌ Erro PV', description: `Usuário: <@${user.id}>\nQID: ${q.id}\nResposta: ${collected.first().content}` }));
      }
      await dm.send({ embeds: [scq_buildEmbed({ title: '📊 Resumo', description: `Chat: ${mainRight ? '✅' : '❌'}\nPV: ✅ ${r} | ❌ ${w}` })] });
      await scq_renderRankingSticky();
    }

    // ======= TICKER: AGENDAMENTO =======
    function startTickers() {
      // Tick de 15s para checar agenda
      setInterval(async () => {
        const now = Date.now();
        const dk = scq_dayKey();

        // Daily Ticker
        if (SC_QUIZ_STATE.lastScheduleDayKey !== dk) {
          // Gera agenda do dia
          const times = [];
          for (let i = 0; i < SC_QUIZ_TOTAL_PER_DAY; i++) {
            const h = scq_randInt(SC_QUIZ_WINDOW_START_HOUR, SC_QUIZ_WINDOW_END_HOUR);
            const m = scq_randInt(0, 59);
            const s = scq_randInt(0, 59);
            const d = new Date(); d.setHours(h, m, s, 0);
            if (d.getTime() > now) times.push(d.getTime());
          }
          SC_QUIZ_STATE.__todaySchedule = times.sort();
          SC_QUIZ_STATE.lastScheduleDayKey = dk;
          scq_save();
        }

        const dueIdx = SC_QUIZ_STATE.__todaySchedule.findIndex(t => now >= t);
        if (dueIdx >= 0) {
          // SÓ envia se NÃO houver quiz ativo
          if (scq_hasActiveQuiz()) return;

          SC_QUIZ_STATE.__todaySchedule.splice(dueIdx, 1);
          scq_save();
          
          // Sorteio aleatório entre Diário e Relâmpago
          Math.random() > 0.5 ? await scq_postDailyQuiz() : await sc_rt_postFastQuiz();
        }
      }, 15000);
    }

    // ======= LISTENERS =======
    client.on('messageCreate', async (msg) => {
      if (!msg.guild || msg.author.bot) return;

      // Gatilho Atividade
      if (msg.channelId === SC_QUIZ_CREATORS_CHANNEL_ID) {
        SC_QUIZ_STATE.activity.counter++;
        if (SC_QUIZ_STATE.activity.counter >= SC_QUIZ_STATE.activity.threshold) {
          SC_QUIZ_STATE.activity.counter = 0;
          scq_save();
          Math.random() > 0.5 ? scq_postDailyQuiz() : sc_rt_postFastQuiz();
        }

        // Handler Respostas
        const isReply = !!msg.reference?.messageId;
        const isLetter = scq_isSingleLetter(msg.content);
        if (isReply || isLetter) await handleQuizAnswer(msg);
      }

      // Comandos Operador
      if (['1262262852949905408', '660311795327828008'].includes(msg.author.id)) {
        if (msg.content === '!quiznow') { await scq_postDailyQuiz(true); msg.react('✅'); }
        if (msg.content === '!fastnow' || msg.content === '!quizfast') { await sc_rt_postFastQuiz(true); msg.react('⚡'); }
        if (msg.content === '!quizreset') {
          await scq_resetEntireQuizState('command_reset');
          await scq_renderRankingSticky();
          msg.reply("✅ Todo o sistema de quiz foi resetado do ZERO.");
        }
        if (msg.content.startsWith('!fastlist')) {
          const page = parseInt(msg.content.split(' ')[1]) || 1;
          const perPage = 15;
          const slice = SC_QUIZ_BANK.slice((page-1)*perPage, page*perPage);
          const list = slice.map(q => `\`${q.id}\` [${q.categoria}] ${q.texto.slice(0,40)}...`).join('\n');
          msg.reply(`**Lista Pág ${page}**:\n${list}\n\nUse \`!fastid <id>\``);
        }
        if (msg.content.startsWith('!fastid')) {
          const id = parseInt(msg.content.split(' ')[1]);
          const q = SC_QUIZ_BANK.find(x => x.id === id);
          if (q) {
            scq_cancelAllActive('manual_id');
            const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
            if (!channel) return;
            await scq_clearCreatorsTrackedMessages(channel);

            const embed = scq_buildEmbed({ title: '⚡ RELÂMPAGO MANUAL', description: `**${q.texto}**\n\n${q.opcoes.join('\n')}`, image: GIF_QUIIZ_URL });
            const sent = await channel.send({ content: `<@&${SC_MENTION_ROLES[0]}>`, embeds: [embed] });
            SC_QUIZ_STATE.rt.active = {
  messageId: sent.id,
  qid: q.id,
  correct: q.resposta,
  correctText: q.opcoes.find(o => o.startsWith(`${q.resposta})`)) || null,
  createdAt: Date.now()
};

SC_QUIZ_STATE.rt.attempts[sent.id] = {};
SC_QUIZ_STATE.rt.lastFastMsgId = sent.id;
SC_QUIZ_STATE.rt.lastWinnerId = null;
SC_QUIZ_STATE.currentValidMessageId = sent.id;
SC_QUIZ_STATE.currentSatisfied = false;
SC_QUIZ_STATE.creatorsCleanupMessageIds.push(sent.id);
scq_save();
          }
        }
      }
    });

    client.on('messageDelete', async (msg) => {
      if (SC_QUIZ_STATE.currentValidMessageId === msg.id) {
        SC_QUIZ_STATE.currentSatisfied = true; scq_save();
      }
    });

    // --- Handler do Botão de Reset ---
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isButton()) return;
      if (interaction.customId !== 'scq_reset_ranking_btn') return;

      // Verifica se o usuário está na lista permitida
      if (!SC_AUTHORIZED_RESET_IDS.includes(interaction.user.id)) {
        return interaction.reply({ content: '❌ Você não tem permissão para resetar o ranking global.', ephemeral: true });
      }

      // Executa o reset
      await scq_resetEntireQuizState('button_reset');
      
      // Atualiza as mensagens do ranking imediatamente
      await scq_renderRankingSticky();
      
      await interaction.reply({ content: '✅ O ranking foi zerado com sucesso!', ephemeral: true });
      await scq_log(scq_buildEmbed({ title: '🧹 Ranking Resetado', description: `O ranking global do Quiz foi zerado por <@${interaction.user.id}>.`, color: 0xFF0000 }));
    });

    client.once('ready', async () => {
      await scq_renderRankingSticky();
      startTickers();
      console.log("[SC_QUIZ] Sistema ativado.");
    });

  } catch (err) { console.error("[SC_QUIZ] Falha Crítica:", err); }
}