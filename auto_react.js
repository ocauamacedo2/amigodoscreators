import { Events, ChannelType, PermissionsBitField } from 'discord.js';

export async function setupAutoReact(client) {
  if (globalThis.SC_AUTO_REACT_INDEX_INSTALLED) return;
  globalThis.SC_AUTO_REACT_INDEX_INSTALLED = true;

  // Canais que reagem apenas a mídias (Fotos/Vídeos)
  const MEDIA_CHANNEL_IDS = [
    "1432149017378426941", // Canal original de fotos
    "1385003944803041371", // Novo canal solicitado
    "1474605177771397223"  // Novo canal solicitado
  ];
  
  // Canal que reage a todas as mensagens
  const ALL_MESSAGES_CHANNEL_ID = "1262262852949905414";

  const MAX_REACTIONS_PER_MESSAGE = 20;
  const BACKFILL_FETCH_PER_PAGE = 100;
  const BACKFILL_MAX_MESSAGES = 5000;
  const REACTION_DELAY_MS = 200;
  const IGNORE_BOT_MESSAGES = true;

  const MANUAL_BACKFILL_COMMAND = "!reagirantigas";

  const PRIORITY_CUSTOM_EMOJI_NAMES = [
    "lgbt", "festinha", "gayyy", "santacreators", "abuser", "roxinho", "aqui",
    "huhu", "coracaoroxo", "coroaroxa", "palmas", "amarelo", "quebrada",
    "alertaa", "bunda", "fofinho", "ban", "e_diorgifs", "diabinho",
  ];

  const UNICODE_REACTIONS = [
    "💜", "❤️", "🩷", "🧡", "💙", "💚", "💛",
    "😍", "🥰", "🤩", "😻",
    "👏", "🙌", "🎉", "🎊", "🔥", "✨",
    "👑", "💫", "🌟", "🥳", "🫶", "💕", "💖", "💞",
    "😁", "😄",
  ];

  let reactionQueue = Promise.resolve();
  const processedMessageIds = new Map();

  function enqueue(task) {
    reactionQueue = reactionQueue
      .then(() => task())
      .catch((err) => {
        console.error("[AUTO_REACT] erro na fila:", err?.message || err);
      });
    return reactionQueue;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function wasRecentlyProcessed(messageId) {
    const now = Date.now();
    const last = processedMessageIds.get(messageId);
    if (last && (now - last) < 15000) return true;
    processedMessageIds.set(messageId, now);
    if (processedMessageIds.size > 5000) {
      for (const [id, ts] of processedMessageIds) {
        if ((now - ts) > 60000) processedMessageIds.delete(id);
      }
    }
    return false;
  }

  function hasMediaContent(message) {
    try {
      const attachments = [...(message.attachments?.values?.() || [])];
      if (attachments.length > 0) {
        for (const att of attachments) {
          const ct = String(att.contentType || "").toLowerCase();
          const name = String(att.name || "").toLowerCase();
          const url = String(att.url || "").toLowerCase();
          if (ct.startsWith("image/") || ct.startsWith("video/")) return true;
          const mediaExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".avif", ".heic", ".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"];
          if (mediaExts.some(ext => name.endsWith(ext) || url.includes(ext))) return true;
        }
        return true;
      }
      for (const embed of message.embeds || []) {
        const imageUrl = String(embed?.image?.url || "").toLowerCase();
        const thumbUrl = String(embed?.thumbnail?.url || "").toLowerCase();
        const videoUrl = String(embed?.video?.url || "").toLowerCase();
        if (imageUrl || thumbUrl || videoUrl || embed?.type === "gifv") return true;
      }
      const content = String(message.content || "").toLowerCase();
      const urlPatterns = ["cdn.discordapp.com", "media.discordapp.net", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".mov"];
      if (urlPatterns.some(p => content.includes(p))) return true;
    } catch (err) {
      console.error("[AUTO_REACT] erro ao detectar mídia:", err?.message || err);
    }
    return false;
  }

  function shouldProcessBotMessage(message) {
    try {
      if (!message?.author?.bot) return true;
      const channelId = message.channel?.id;
      if (MEDIA_CHANNEL_IDS.includes(channelId)) return true;
      return false;
    } catch { return false; }
  }

  function getPriorityCustomEmojis(guild) {
    if (!guild?.emojis?.cache) return [];
    const all = [...guild.emojis.cache.values()].filter((e) => e.available !== false);
    const selected = [];
    const usedIds = new Set();
    for (const wantedName of PRIORITY_CUSTOM_EMOJI_NAMES) {
      const target = String(wantedName).toLowerCase();
      let found = all.find((emoji) => String(emoji.name || "").toLowerCase() === target) ||
                  all.find((emoji) => String(emoji.name || "").toLowerCase().includes(target));
      if (found && !usedIds.has(found.id)) {
        usedIds.add(found.id);
        selected.push(found);
      }
    }
    return selected;
  }

  function buildReactionList(guild) {
    const finalList = [];
    const seen = new Set();
    const priorityCustoms = getPriorityCustomEmojis(guild);
    for (const emoji of priorityCustoms) {
      const key = String(emoji?.id || emoji);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      finalList.push(emoji.toString());
      if (finalList.length >= MAX_REACTIONS_PER_MESSAGE) return finalList;
    }
    for (const emoji of UNICODE_REACTIONS) {
      if (seen.has(emoji)) continue;
      seen.add(emoji);
      finalList.push(emoji);
      if (finalList.length >= MAX_REACTIONS_PER_MESSAGE) break;
    }
    return finalList;
  }

  async function reactToMessage(message, mode = "unknown") {
    if (!message?.guild) return;
    const reactions = buildReactionList(message.guild);
    if (!reactions.length) return;
    for (const emoji of reactions) {
      await enqueue(async () => {
        try {
          const alreadyThere = message.reactions.cache.find((r) => {
            if (typeof r.emoji.id === "string" && String(emoji).startsWith("<")) {
              return String(emoji).includes(r.emoji.id);
            }
            return r.emoji.name === emoji;
          });
          if (alreadyThere?.me) return;
          if (message.reactions.cache.size >= 20 && !alreadyThere) return;
          await message.react(emoji);
          await sleep(REACTION_DELAY_MS);
        } catch (err) {
          const status = Number(err?.status || 0);
          const code = Number(err?.code || 0);
          const ignoreCodes = [10008, 30010, 10014, 50001, 50013];
          if (status === 404 || ignoreCodes.includes(code)) return;
          console.error(`[AUTO_REACT] erro ao reagir msg=${message.id} modo=${mode} emoji=${emoji}:`, err?.message);
        }
      });
    }
  }

  async function processAutoReactMessage(message, source = "create") {
    if (!message || !message.guild || !message.channel || message.system) return;
    if (IGNORE_BOT_MESSAGES && !shouldProcessBotMessage(message)) return;

    const channelId = message.channel.id;

    if (channelId === ALL_MESSAGES_CHANNEL_ID) {
      if (message.author?.bot) {
        for (let attempt = 0; attempt < 6; attempt++) {
          if (attempt > 0) await sleep(800);
          try { if (message.partial) await message.fetch(); } catch {}
          if (hasMediaContent(message)) {
            if (wasRecentlyProcessed(message.id)) return;
            await reactToMessage(message, `all-bot-${source}`);
            return;
          }
        }
        return;
      }
      if (wasRecentlyProcessed(message.id)) return;
      await reactToMessage(message, "all");
      return;
    }

    if (MEDIA_CHANNEL_IDS.includes(channelId)) {
      if (message.author?.bot) {
        for (let attempt = 0; attempt < 6; attempt++) {
          if (attempt > 0) await sleep(800);
          try { if (message.partial) await message.fetch(); } catch {}
          if (hasMediaContent(message)) {
            if (wasRecentlyProcessed(message.id)) return;
            await reactToMessage(message, `media-bot-${source}`);
            return;
          }
        }
        return;
      }
      if (hasMediaContent(message)) {
        if (wasRecentlyProcessed(message.id)) return;
        await reactToMessage(message, `media-human-${source}`);
      }
    }
  }

  async function backfillChannel(channelId, mode, options = {}) {
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return { scanned: 0, processed: 0 };

    const maxMessages = Number(options.maxMessages || BACKFILL_MAX_MESSAGES);
    const sourceLabel = options.manual ? "manual" : "auto";

    let lastId = undefined;
    let scanned = 0;
    let processed = 0;

    while (scanned < maxMessages) {
      const remaining = maxMessages - scanned;
      const limit = Math.min(BACKFILL_FETCH_PER_PAGE, remaining);
      const messages = await channel.messages.fetch({ limit, before: lastId }).catch(() => null);
      if (!messages?.size) break;
      const ordered = [...messages.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      for (const msg of ordered) {
        scanned++;
        if (!msg || msg.system) continue;
        if (IGNORE_BOT_MESSAGES && !shouldProcessBotMessage(msg)) continue;
        if (mode === "media" && !hasMediaContent(msg)) continue;
        await reactToMessage(msg, sourceLabel);
        processed++;
      }
      lastId = ordered[0]?.id;
      if (!lastId || messages.size < limit) break;
    }
    console.log(`[AUTO_REACT] backfill ${sourceLabel} canal ${channelId} concluído. Vasculhadas: ${scanned} | Processadas: ${processed}`);
    return { scanned, processed };
  }

  async function handleManualBackfillCommand(message) {
    if (!message?.guild || !message?.channel || message.author?.bot) return false;
    const content = String(message.content || "").trim();
    if (!content.toLowerCase().startsWith(MANUAL_BACKFILL_COMMAND)) return false;

    const isAdmin = message.member?.permissions?.has(PermissionsBitField.Flags.Administrator) ||
                    message.member?.permissions?.has(PermissionsBitField.Flags.ManageGuild);
    if (!isAdmin) {
      await message.reply("❌ Você não tem permissão para usar esse comando.");
      return true;
    }

    const parts = content.split(/\s+/);
    const targetRaw = String(parts[1] || "").toLowerCase();
    const amountRaw = parts[2];

    let channelId = null;
    let mode = null;
    let label = null;

    if (["fotos", "foto", "media", "midia"].includes(targetRaw)) {
      channelId = MEDIA_CHANNEL_IDS[0]; // Padrão fotos
      mode = "media";
      label = "canal de fotos/vídeos";
    } else if (["geral", "all"].includes(targetRaw)) {
      channelId = ALL_MESSAGES_CHANNEL_ID;
      mode = "all";
      label = "canal geral";
    } else {
      await message.reply("⚠️ Usa assim:\n`!reagirantigas fotos` ou `!reagirantigas geral` [quantidade]");
      return true;
    }

    let customMaxMessages = BACKFILL_MAX_MESSAGES;
    if (amountRaw && /^\d+$/.test(amountRaw)) {
      customMaxMessages = Math.max(1, Math.min(Number(amountRaw), 20000));
    }

    await message.reply(`🔄 Iniciando backfill manual no ${label}...\n📦 Limite: **${customMaxMessages}** mensagens.`);

    try {
      const result = await backfillChannel(channelId, mode, { maxMessages: customMaxMessages, manual: true });
      await message.reply(`✅ Backfill manual concluído em ${label}.\n• Vasculhadas: **${result?.scanned ?? 0}**\n• Processadas: **${result?.processed ?? 0}**`);
    } catch (err) {
      console.error("[AUTO_REACT] erro no comando manual:", err);
      await message.reply("❌ Deu erro ao rodar o backfill manual.");
    }
    return true;
  }

  client.on(Events.MessageCreate, async (message) => {
    try {
      if (await handleManualBackfillCommand(message)) return;
      await processAutoReactMessage(message, "create");
    } catch (err) { console.error("[AUTO_REACT] erro em MessageCreate:", err); }
  });

  client.on(Events.MessageUpdate, async (_oldMessage, newMessage) => {
    try {
      if (newMessage.partial) try { await newMessage.fetch(); } catch {}
      processAutoReactMessage(newMessage, "update").catch(err => {
        console.error("[AUTO_REACT] erro interno em processAutoReactMessage(update):", err);
      });
    } catch (err) { console.error("[AUTO_REACT] erro em MessageUpdate:", err); }
  });

  async function startAutoReactBackfill() {
    console.log("[AUTO_REACT] iniciando backfill automático...");
    
    // Backfill para todos os canais de mídia
    for (const channelId of MEDIA_CHANNEL_IDS) {
      try {
        await backfillChannel(channelId, "media", { maxMessages: BACKFILL_MAX_MESSAGES });
      } catch (err) { console.error(`[AUTO_REACT] erro no backfill do canal ${channelId}:`, err); }
    }

    // Backfill para o canal geral
    try {
      await backfillChannel(ALL_MESSAGES_CHANNEL_ID, "all", { maxMessages: BACKFILL_MAX_MESSAGES });
    } catch (err) { console.error("[AUTO_REACT] erro no backfill do canal geral:", err); }

    console.log("[AUTO_REACT] backfill automático concluído.");
  }

  if (client.isReady()) {
    startAutoReactBackfill().catch(err => console.error("[AUTO_REACT] erro ao iniciar:", err));
  } else {
    client.once(Events.ClientReady, async () => {
      await startAutoReactBackfill();
    });
  }
}