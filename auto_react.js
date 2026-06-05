import { Events, ChannelType, PermissionsBitField } from 'discord.js';

export async function setupAutoReact(client) {
  if (globalThis.SC_AUTO_REACT_INDEX_INSTALLED) return;
  globalThis.SC_AUTO_REACT_INDEX_INSTALLED = true;

  // Canais que reagem apenas a mídias (Fotos/Vídeos)
  const MEDIA_CHANNEL_IDS = [
    "1432149017378426941", // Canal original de fotos
    "1385003944803041371", // Canal solicitado anteriormente
    "1474605177771397223", // Canal solicitado anteriormente
    "1386503496353976470"  // Novo canal adicionado agora
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

  async function safeReply(message, content) {
    try {
      return await message.reply(content);
    } catch (err) {
      const msg = String(err?.message || err);
      const code = err?.code || err?.rawError?.code;

      if (
        msg.includes("Unknown message") ||
        msg.includes("MESSAGE_REFERENCE_UNKNOWN_MESSAGE") ||
        code === 50035 ||
        code === 10008
      ) {
        return await message.channel.send(content).catch(() => null);
      }

      throw err;
    }
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

function buildExistingReactionList(message) {
  const existing = [];

  try {
    for (const reaction of message.reactions.cache.values()) {
      if (reaction?.emoji?.id) {
        existing.push(reaction.emoji.toString());
      } else if (reaction?.emoji?.name) {
        existing.push(reaction.emoji.name);
      }
    }
  } catch {}

  return existing;
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

function extractCustomEmojiId(emoji) {
  const match = String(emoji).match(/^<a?:[^:]+:(\d+)>$/);
  return match?.[1] || null;
}

function reactionMatchesEmoji(reaction, emoji) {
  const customId = extractCustomEmojiId(emoji);

  if (customId) {
    return reaction?.emoji?.id === customId;
  }

  return reaction?.emoji?.name === emoji;
}

async function reactionHasMe(reaction, clientUserId) {
  try {
    if (!reaction || !clientUserId) return false;

    // Se o cache já diz que sim, confiamos para evitar fetch desnecessário
    if (reaction.me === true) return true;

    // Caso contrário (especialmente em msgs antigas), fazemos a busca real dos usuários
    const users = await reaction.users.fetch().catch(() => null);
    if (users?.has?.(clientUserId)) return true;

    return false;
  } catch {
    return false;
  }
}

async function reactToMessage(message, mode = "unknown") {
  if (!message?.guild) {
    return { added: 0, alreadyMine: 0, noSlot: 0, failed: 0, blocked: 0, ignored: 0 };
  }

  try {
    if (message.partial) {
      await message.fetch();
    }

    const freshMessage = await message.channel.messages.fetch(message.id).catch(() => null);
    if (freshMessage) {
      message = freshMessage;
    }
  } catch {}

  const existingReactions = buildExistingReactionList(message);
  const defaultReactions = buildReactionList(message.guild);

  const reactions = [];
  const seen = new Set();

  for (const emoji of [...existingReactions, ...defaultReactions]) {
    const key = String(emoji);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    reactions.push(emoji);

    if (reactions.length >= MAX_REACTIONS_PER_MESSAGE) break;
  }

  const stats = {
    added: 0,
    alreadyMine: 0,
    noSlot: 0,
    failed: 0,
    blocked: 0,
    ignored: 0,
  };

  for (const emoji of reactions) {
    await enqueue(async () => {
      try {
        const alreadyThere = message.reactions.cache.find((r) =>
          reactionMatchesEmoji(r, emoji)
        );

        const botAlreadyReacted = await reactionHasMe(alreadyThere, message.client?.user?.id);

        if (botAlreadyReacted) {
          stats.alreadyMine++;
          return;
        }

        if (message.reactions.cache.size >= 20 && !alreadyThere) {
          stats.noSlot++;
          return;
        }

        if (alreadyThere && !botAlreadyReacted) {
          if (mode.includes("manual") || mode.includes("old")) {
            console.log(`[AUTO_REACT] stack antigo: msg=${message.id} canal=${message.channel?.id} emoji=${emoji} já existia, mas o bot ainda não tinha reagido. Tentando reagir por cima...`);
          }
        }

        await message.react(emoji);
        stats.added++;
      } catch (err) {
        const msg = String(err?.message || err);
        const code = err?.code || err?.rawError?.code;

        if (
          msg.includes("Reaction blocked") ||
          code === 90001
        ) {
          stats.blocked++;
          return;
        }

        if (
          msg.includes("Unknown Emoji") ||
          msg.includes("Missing Access") ||
          msg.includes("Missing Permissions") ||
          msg.includes("Unknown Message") ||
          msg.includes("Invalid Form Body") ||
          msg.includes("10014") ||
          msg.includes("50001") ||
          msg.includes("50013") ||
          msg.includes("10008") ||
          msg.includes("30010") ||
          code === 30010
        ) {
          stats.ignored++;
          return;
        }

        stats.failed++;

        console.error(
          `[AUTO_REACT] erro real ao reagir msg=${message.id} canal=${message.channel?.id} modo=${mode} emoji=${emoji}:`,
          err?.message || err
        );
      }
    });
  }

  return stats;
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
    if (!channel) {
      console.log(`[AUTO_REACT] canal ${channelId} não encontrado.`);
      return { scanned: 0, processed: 0, added: 0, alreadyMine: 0, noSlot: 0, failed: 0, blocked: 0 };
    }

    const maxMessages = Number(options.maxMessages || BACKFILL_MAX_MESSAGES);
    const sourceLabel = options.manual ? "manual" : "auto";

    let lastId = undefined;
    let scanned = 0;
    let processed = 0;
    let added = 0;
    let alreadyMine = 0;
    let noSlot = 0;
    let failed = 0;
    let blocked = 0;
    let ignored = 0;

    console.log(`[AUTO_REACT] backfill ${sourceLabel} iniciado no canal ${channelId}. Limite: ${maxMessages}`);

    while (scanned < maxMessages) {
      const remaining = maxMessages - scanned;
      const limit = Math.min(BACKFILL_FETCH_PER_PAGE, remaining);

      const messages = await channel.messages.fetch({ limit, before: lastId }).catch((err) => {
        console.error(`[AUTO_REACT] erro ao buscar mensagens do canal ${channelId}:`, err?.message || err);
        return null;
      });

      if (!messages?.size) break;

      const ordered = [...messages.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);

      for (const msg of ordered) {
        scanned++;

        if (!msg || msg.system) continue;
        if (IGNORE_BOT_MESSAGES && !shouldProcessBotMessage(msg)) continue;
        if (mode === "media" && !hasMediaContent(msg)) continue;

        const freshMsg = await msg.channel.messages.fetch(msg.id).catch(() => msg);
        const stats = await reactToMessage(freshMsg, `${sourceLabel}-old`);

        added += Number(stats?.added || 0);
        alreadyMine += Number(stats?.alreadyMine || 0);
        noSlot += Number(stats?.noSlot || 0);
        failed += Number(stats?.failed || 0);
        blocked += Number(stats?.blocked || 0);
        ignored += Number(stats?.ignored || 0);

        if ((stats?.added || 0) > 0 || (stats?.alreadyMine || 0) > 0) {
          processed++;
        }

        await sleep(REACTION_DELAY_MS);
      }

      console.log(
        `[AUTO_REACT] backfill ${sourceLabel} canal ${channelId} em andamento. ` +
        `Vasculhadas: ${scanned} | Processadas: ${processed} | ` +
`Add agora: ${added} | Já eram minhas: ${alreadyMine} | Sem slot: ${noSlot} | Bloqueadas: ${blocked} | Ignoradas: ${ignored} | Falhas reais: ${failed}`
      );

      lastId = ordered[0]?.id;
      if (!lastId || messages.size < limit) break;
    }

    console.log(
      `[AUTO_REACT] backfill ${sourceLabel} canal ${channelId} concluído. ` +
      `Vasculhadas: ${scanned} | Processadas: ${processed} | ` +
      `Add agora: ${added} | Já eram minhas: ${alreadyMine} | Sem slot: ${noSlot} | Bloqueadas: ${blocked} | Ignoradas: ${ignored} | Falhas reais: ${failed}`
    );

    return { scanned, processed, added, alreadyMine, noSlot, failed, blocked, ignored };
  }

  async function backfillChannels(channelIds, mode, options = {}) {
    let totalScanned = 0;
    let totalProcessed = 0;
    let totalAdded = 0;
    let totalAlreadyMine = 0;
    let totalNoSlot = 0;
    let totalFailed = 0;
    let totalBlocked = 0;
    let totalIgnored = 0;

    console.log(`[AUTO_REACT] backfill em múltiplos canais iniciado. Canais: ${channelIds.join(", ")}`);

    for (const channelId of channelIds) {
      console.log(`[AUTO_REACT] iniciando próximo canal da lista: ${channelId}`);

      const result = await backfillChannel(channelId, mode, options);

      totalScanned += Number(result?.scanned || 0);
      totalProcessed += Number(result?.processed || 0);
      totalAdded += Number(result?.added || 0);
      totalAlreadyMine += Number(result?.alreadyMine || 0);
      totalNoSlot += Number(result?.noSlot || 0);
      totalFailed += Number(result?.failed || 0);
      totalBlocked += Number(result?.blocked || 0);
      totalIgnored += Number(result?.ignored || 0);
    }

    console.log(
      `[AUTO_REACT] backfill em múltiplos canais concluído. ` +
      `Vasculhadas: ${totalScanned} | Processadas: ${totalProcessed} | ` +
     `Add agora: ${totalAdded} | Já eram minhas: ${totalAlreadyMine} | Sem slot: ${totalNoSlot} | Bloqueadas: ${totalBlocked} | Ignoradas: ${totalIgnored} | Falhas reais: ${totalFailed}`
    );

    return {
      scanned: totalScanned,
      processed: totalProcessed,
      added: totalAdded,
      alreadyMine: totalAlreadyMine,
      noSlot: totalNoSlot,
      failed: totalFailed,
      blocked: totalBlocked,
      ignored: totalIgnored,
    };
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
      channelId = MEDIA_CHANNEL_IDS;
      mode = "media";
      label = "todos os canais de fotos/vídeos";
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

    await safeReply(message, `🔄 Iniciando backfill manual no ${label}...\n📦 Limite: **${customMaxMessages}** mensagens.`);

    try {
      const result = Array.isArray(channelId)
        ? await backfillChannels(channelId, mode, { maxMessages: customMaxMessages, manual: true })
        : await backfillChannel(channelId, mode, { maxMessages: customMaxMessages, manual: true });

      await safeReply(
        message,
        `✅ Backfill manual concluído em ${label}.\n` +
        `• Mensagens vasculhadas: **${result?.scanned ?? 0}**\n` +
        `• Mensagens encontradas para reação: **${result?.processed ?? 0}**\n` +
        `• Reações adicionadas agora: **${result?.added ?? 0}**\n` +
        `• Reações que o bot já tinha colocado: **${result?.alreadyMine ?? 0}**\n` +
        `• Sem espaço para emoji novo: **${result?.noSlot ?? 0}**\n` +
        `• Bloqueadas pelo Discord: **${result?.blocked ?? 0}**\n` +
        `• Ignoradas sem risco: **${result?.ignored ?? 0}**\n` +
        `• Falhas reais: **${result?.failed ?? 0}**\n\n` +
        `ℹ️ Se “adicionadas agora” ficar em **0** e “já tinha colocado” ficar alto, significa que o bot já tinha reagido nessas mensagens antigas.`
      );
    } catch (err) {
      console.error("[AUTO_REACT] erro no comando manual:", err);
      await safeReply(message, "❌ Deu erro ao rodar o backfill manual.");
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
    console.log("[AUTO_REACT] backfill automático desativado para evitar conflito com o manual.");
    return;
  }

  if (client.isReady()) {
    console.log("[AUTO_REACT] sistema pronto. Backfill automático está desativado.");
  } else {
    client.once(Events.ClientReady, async () => {
      console.log("[AUTO_REACT] sistema pronto. Backfill automático está desativado.");
    });
  }
}