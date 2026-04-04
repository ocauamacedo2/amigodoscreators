// ===================================================================
// 🧩 TOPO PADRONIZADO (COMPATÍVEL COM MÓDULOS DO BOT PRINCIPAL)
// ===================================================================

// ---- Variáveis de ambiente ----
import dotenv from 'dotenv';
dotenv.config({ override: true }); // força usar o .env do projeto

// ---- Imports do Discord.js ----
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  PermissionFlagsBits,
  EmbedBuilder,
  ActivityType,
  Events,
  Partials,
  REST,
  Routes,
  AuditLogEvent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  OverwriteType,
  AttachmentBuilder,
  TimestampStyles,
  time,
  UserSelectMenuBuilder,
  ApplicationCommandOptionType,
} from 'discord.js';

// ---- Permite usar require() dentro de módulo ESM ----
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
globalThis.require ??= require;


// adiciona este import junto dos demais, no TOPO:
import {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  getVoiceConnection,
  generateDependencyReport,
} from '@discordjs/voice';




// ---- Módulos nativos / extras ----
import fs from 'fs';

// ---- Proteções globais pra não cair o processo ----
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e));

// ---- Helper pra log seguro do token ----
function mask(t) {
  const s = (t ?? '').toString().trim();
  return { parts: s ? s.split('.').length : 0, len: s.length, sample: s ? `${s.slice(0,6)}...${s.slice(-6)}` : '(vazio)' };
}

// ---- Token bootstrap seguro ----
const BOT_TOKEN = (process.env.DISCORD_TOKEN?.trim() || process.env.TOKEN?.trim() || '').replace(/\s+/g, '');

if (!BOT_TOKEN || BOT_TOKEN.split('.').length !== 3) {
  console.error('❌ DISCORD_TOKEN/TOKEN ausente ou inválido (precisa ter 3 partes).');
  process.exit(1);
}

// ---- Log seguro do token ----
console.log('[TOKEN OK]', mask(BOT_TOKEN));

// ---- Compat pra módulos antigos ----
globalThis.token = BOT_TOKEN;

// ===================================================================
// 🧠 CLIENT GLOBAL COMPATÍVEL
// ===================================================================
if (!globalThis.__SC_CLIENT__) {
  globalThis.__SC_CLIENT__ = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [
      Partials.GuildMember,
      Partials.User,
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
    ],
    allowedMentions: { parse: [], repliedUser: false },
  });
}

// ---- Exporta o client para uso global ----
export const client = globalThis.__SC_CLIENT__;
globalThis.client = client; // garante visibilidade global


// ===== Helper global: onceIn (throttle por chave) =====
// Executa a função no máximo 1x por intervalo por chave.
// Uso: await onceIn('limpeza_set', 10 * 60_000, async () => { ... })
const __ONCEIN_MAP__ = (globalThis.__ONCEIN_MAP__ ||= new Map());

async function onceIn(key, intervalMs, fn) {
  try {
    const now = Date.now();
    const last = __ONCEIN_MAP__.get(key) || 0;
    if (now - last >= intervalMs) {
      __ONCEIN_MAP__.set(key, now);
      return await fn();
    }
    // fora da janela: não executa, mas não quebra
    return null;
  } catch (e) {
    console.warn('[onceIn] erro:', e?.message || e);
    return null;
  }
}
globalThis.onceIn ??= onceIn;


// ===== Helpers globais de canal (cache + fetch) =====
async function getChannel(cli, id) {
  try {
    if (!cli || !id) return null;
    return cli.channels.cache.get(id) ?? await cli.channels.fetch(id);
  } catch {
    return null;
  }
}
globalThis.getChannel ??= getChannel; // garante disponível globalmente


// ===================================================================
// 🧩 DEBUG (MODAIS / INTERACTIONS / ETC.)
// ===================================================================
if (!client.__DEBUG_MODAL_LOG__) {
  client.__DEBUG_MODAL_LOG__ = true;
  client.on('interactionCreate', (i) => {
    if (i.isModalSubmit && i.isModalSubmit()) {
      console.log('[DEBUG MODAL]', {
        customId: i.customId,
        triedIds: [
          'organizacao',
          'input_org',
          'familia',
          'input_familia',
          'motivo',
          'input_motivo',
        ],
      });
    }
  });
}

// ===================================================================
// 🔐 LOGIN ÚNICO
// ===================================================================
if (!client.__loggedIn) {
  client.__loggedIn = true;
  await client.login(BOT_TOKEN).catch((e) => {
    console.error('Erro ao fazer login no bot:', e);
    process.exit(1);
  });

  // ✅ Verifica se as libs de criptografia/opus/ffmpeg foram detectadas
  try {
    console.log('\n' + generateDependencyReport() + '\n');
  } catch (err) {
    console.warn('Não foi possível gerar o dependency report:', err?.message || err);
  }
}


// ===================================================================
// ===================================================================
// 🔥 AUTO REACT + COMANDO MANUAL DE BACKFILL
// ===================================================================
if (!globalThis.SC_AUTO_REACT_INDEX_INSTALLED) {
  globalThis.SC_AUTO_REACT_INDEX_INSTALLED = true;

  const PHOTO_CHANNEL_ID = "1432149017378426941";
  const ALL_MESSAGES_CHANNEL_ID = "1262262852949905414";

  const MAX_REACTIONS_PER_MESSAGE = 20;
  const BACKFILL_FETCH_PER_PAGE = 100;
  const BACKFILL_MAX_MESSAGES = 5000;
  const REACTION_DELAY_MS = 200;
  const IGNORE_BOT_MESSAGES = true;

  const MANUAL_BACKFILL_COMMAND = "!reagirantigas";

  const PRIORITY_CUSTOM_EMOJI_NAMES = [
    "lgbt",
    "festinha",
    "gayyy",
    "santacreators",
    "abuser",
    "roxinho",
    "aqui",
    "huhu",
    "coracaoroxo",
    "coroaroxa",
    "palmas",
    "amarelo",
    "quebrada",
    "alertaa",
    "bunda",
    "fofinho",
    "ban",
    "e_diorgifs",
    "diabinho",
  ];

  const UNICODE_REACTIONS = [
    "💜", "❤️", "🩷", "🧡", "💙", "💚", "💛",
    "😍", "🥰", "🤩", "😻",
    "👏", "🙌",
    "🎉", "🎊",
    "🔥", "✨",
    "👑", "💫", "🌟",
    "🥳", "🫶",
    "💕", "💖", "💞",
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

  if (last && (now - last) < 15000) {
    return true;
  }

  processedMessageIds.set(messageId, now);

  if (processedMessageIds.size > 5000) {
    for (const [id, ts] of processedMessageIds) {
      if ((now - ts) > 60000) {
        processedMessageIds.delete(id);
      }
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
        const proxyURL = String(att.proxyURL || "").toLowerCase();

        if (ct.startsWith("image/")) return true;
        if (ct.startsWith("video/")) return true;

        if (
          name.endsWith(".png") ||
          name.endsWith(".jpg") ||
          name.endsWith(".jpeg") ||
          name.endsWith(".gif") ||
          name.endsWith(".webp") ||
          name.endsWith(".bmp") ||
          name.endsWith(".avif") ||
          name.endsWith(".heic") ||
          name.endsWith(".mp4") ||
          name.endsWith(".mov") ||
          name.endsWith(".webm") ||
          name.endsWith(".mkv") ||
          name.endsWith(".avi") ||
          name.endsWith(".m4v") ||
          url.includes(".png") ||
          url.includes(".jpg") ||
          url.includes(".jpeg") ||
          url.includes(".gif") ||
          url.includes(".webp") ||
          url.includes(".bmp") ||
          url.includes(".avif") ||
          url.includes(".heic") ||
          url.includes(".mp4") ||
          url.includes(".mov") ||
          url.includes(".webm") ||
          url.includes(".mkv") ||
          url.includes(".avi") ||
          url.includes(".m4v") ||
          proxyURL.includes(".png") ||
          proxyURL.includes(".jpg") ||
          proxyURL.includes(".jpeg") ||
          proxyURL.includes(".gif") ||
          proxyURL.includes(".webp") ||
          proxyURL.includes(".bmp") ||
          proxyURL.includes(".avif") ||
          proxyURL.includes(".heic") ||
          proxyURL.includes(".mp4") ||
          proxyURL.includes(".mov") ||
          proxyURL.includes(".webm") ||
          proxyURL.includes(".mkv") ||
          proxyURL.includes(".avi") ||
          proxyURL.includes(".m4v")
        ) {
          return true;
        }
      }

      return true;
    }

    for (const embed of message.embeds || []) {
      const imageUrl = String(embed?.image?.url || "").toLowerCase();
      const thumbUrl = String(embed?.thumbnail?.url || "").toLowerCase();
      const videoUrl = String(embed?.video?.url || "").toLowerCase();
      const embedUrl = String(embed?.url || "").toLowerCase();

      if (
        imageUrl ||
        thumbUrl ||
        videoUrl ||
        embed?.type === "gifv" ||
        imageUrl.includes("media.discordapp.net") ||
        imageUrl.includes("cdn.discordapp.com") ||
        thumbUrl.includes("media.discordapp.net") ||
        thumbUrl.includes("cdn.discordapp.com") ||
        videoUrl.includes("media.discordapp.net") ||
        videoUrl.includes("cdn.discordapp.com") ||
        embedUrl.includes(".png") ||
        embedUrl.includes(".jpg") ||
        embedUrl.includes(".jpeg") ||
        embedUrl.includes(".gif") ||
        embedUrl.includes(".webp") ||
        embedUrl.includes(".mp4")
      ) {
        return true;
      }
    }

    const content = String(message.content || "").toLowerCase();
    if (
      content.includes("cdn.discordapp.com") ||
      content.includes("media.discordapp.net") ||
      content.includes(".png") ||
      content.includes(".jpg") ||
      content.includes(".jpeg") ||
      content.includes(".gif") ||
      content.includes(".webp") ||
      content.includes(".bmp") ||
      content.includes(".avif") ||
      content.includes(".heic") ||
      content.includes(".mp4") ||
      content.includes(".mov") ||
      content.includes(".webm") ||
      content.includes(".mkv") ||
      content.includes(".avi") ||
      content.includes(".m4v")
    ) {
      return true;
    }
  } catch (err) {
    console.error("[AUTO_REACT] erro ao detectar mídia:", err?.message || err);
  }

  return false;
}

function shouldProcessBotMessage(message) {
  try {
    if (!message?.author?.bot) return true;

    const channelId = message.channel?.id;

    if (channelId === PHOTO_CHANNEL_ID) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

  function getPriorityCustomEmojis(guild) {
    if (!guild?.emojis?.cache) return [];

    const all = [...guild.emojis.cache.values()].filter((e) => e.available !== false);
    const selected = [];
    const usedIds = new Set();

    for (const wantedName of PRIORITY_CUSTOM_EMOJI_NAMES) {
      const target = String(wantedName).toLowerCase();

      let found = all.find((emoji) => String(emoji.name || "").toLowerCase() === target);

      if (!found) {
        found = all.find((emoji) => String(emoji.name || "").toLowerCase().includes(target));
      }

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

      if (finalList.length >= MAX_REACTIONS_PER_MESSAGE) {
        return finalList;
      }
    }

    for (const emoji of UNICODE_REACTIONS) {
      if (seen.has(emoji)) continue;
      seen.add(emoji);
      finalList.push(emoji);

      if (finalList.length >= MAX_REACTIONS_PER_MESSAGE) {
        break;
      }
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

          if (message.reactions.cache.size >= 20 && !alreadyThere) {
            return;
          }

          await message.react(emoji);
          await sleep(REACTION_DELAY_MS);
               } catch (err) {
          const msg = String(err?.message || err);
          const status = Number(err?.status || 0);
          const code = Number(err?.code || 0);

          if (
            msg.includes("Unknown Emoji") ||
            msg.includes("Missing Access") ||
            msg.includes("Missing Permissions") ||
            msg.includes("Unknown Message") ||
            msg.includes("Invalid Form Body") ||
            msg.includes("Not Found") ||
            msg.includes("404: Not Found") ||
            msg.includes("10014") ||
            msg.includes("50001") ||
            msg.includes("50013") ||
            msg.includes("10008") ||
            msg.includes("30010") ||
            status === 404 ||
            code === 10008 ||
            code === 30010
          ) {
            return;
          }

          console.error(
            `[AUTO_REACT] erro ao reagir msg=${message.id} canal=${message.channel?.id} modo=${mode} emoji=${emoji}:`,
            err
          );
        }
      });
    }
  }

async function processAutoReactMessage(message, source = "create") {
  if (!message) return;
  if (!message.guild) return;
  if (!message.channel) return;
  if (message.system) return;

  if (IGNORE_BOT_MESSAGES && !shouldProcessBotMessage(message)) return;

  const channelId = message.channel.id;

  if (channelId === ALL_MESSAGES_CHANNEL_ID) {
    if (message.author?.bot) {
      for (let attempt = 0; attempt < 6; attempt++) {
        if (attempt > 0) {
          await sleep(800);

          try {
            if (message.partial) {
              await message.fetch();
            }
          } catch {}

          try {
            const freshMessage = await message.channel.messages.fetch(message.id).catch(() => null);
            if (freshMessage) message = freshMessage;
          } catch {}
        }

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

  if (channelId === PHOTO_CHANNEL_ID) {
    if (message.author?.bot) {
      for (let attempt = 0; attempt < 6; attempt++) {
        if (attempt > 0) {
          await sleep(800);

          try {
            if (message.partial) {
              await message.fetch();
            }
          } catch {}

          try {
            const freshMessage = await message.channel.messages.fetch(message.id).catch(() => null);
            if (freshMessage) message = freshMessage;
          } catch {}
        }

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
      console.warn(`[AUTO_REACT] canal ${channelId} não encontrado no backfill.`);
      return { scanned: 0, processed: 0 };
    }

    if (
      channel.type !== ChannelType.GuildText &&
      channel.type !== ChannelType.GuildAnnouncement
    ) {
      console.warn(`[AUTO_REACT] canal ${channelId} não é texto/anúncio. Tipo: ${channel.type}`);
      return { scanned: 0, processed: 0 };
    }

    const maxMessages = Number(options.maxMessages || BACKFILL_MAX_MESSAGES);
    const sourceLabel = options.manual ? "manual" : "auto";

    let lastId = undefined;
    let scanned = 0;
    let processed = 0;

    while (scanned < maxMessages) {
      const remaining = maxMessages - scanned;
      const limit = Math.min(BACKFILL_FETCH_PER_PAGE, remaining);

      const messages = await channel.messages.fetch({
        limit,
        before: lastId,
      }).catch(() => null);

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

    console.log(
      `[AUTO_REACT] backfill ${sourceLabel} do canal ${channelId} concluído. Vasculhadas: ${scanned} | Processadas: ${processed}`
    );

    return { scanned, processed };
  }

  async function handleManualBackfillCommand(message) {
    if (!message?.guild || !message?.channel) return false;
    if (message.author?.bot) return false;

    const content = String(message.content || "").trim();
    if (!content.toLowerCase().startsWith(MANUAL_BACKFILL_COMMAND)) {
      return false;
    }

    const isAdmin =
      message.member?.permissions?.has(PermissionsBitField.Flags.Administrator) ||
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
      channelId = PHOTO_CHANNEL_ID;
      mode = "media";
      label = "canal de fotos/vídeos";
    } else if (["geral", "all"].includes(targetRaw)) {
      channelId = ALL_MESSAGES_CHANNEL_ID;
      mode = "all";
      label = "canal geral";
    } else {
      await message.reply(
        "⚠️ Usa assim:\n`!reagirantigas fotos`\n`!reagirantigas geral`\n`!reagirantigas fotos 2000`\n`!reagirantigas geral 3000`"
      );
      return true;
    }

    let customMaxMessages = BACKFILL_MAX_MESSAGES;
    if (amountRaw && /^\d+$/.test(amountRaw)) {
      customMaxMessages = Math.max(1, Math.min(Number(amountRaw), 20000));
    }

    await message.reply(
      `🔄 Iniciando backfill manual no ${label}...\n📦 Limite: **${customMaxMessages}** mensagens.`
    );

    try {
      const result = await backfillChannel(channelId, mode, {
        maxMessages: customMaxMessages,
        manual: true,
      });

      await message.reply(
        `✅ Backfill manual concluído em ${label}.\n` +
        `• Vasculhadas: **${result?.scanned ?? 0}**\n` +
        `• Processadas: **${result?.processed ?? 0}**`
      );
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
    } catch (err) {
      console.error("[AUTO_REACT] erro em MessageCreate:", err);
    }
  });

client.on(Events.MessageUpdate, async (_oldMessage, newMessage) => {
  try {
    if (newMessage.partial) {
      try {
        await newMessage.fetch();
      } catch {}
    }

    processAutoReactMessage(newMessage, "update").catch((err) => {
      console.error("[AUTO_REACT] erro interno em processAutoReactMessage(update):", err);
    });
  } catch (err) {
    console.error("[AUTO_REACT] erro em MessageUpdate:", err);
  }
});

  async function startAutoReactBackfill() {
    console.log("[AUTO_REACT] iniciando backfill automático...");

    try {
      await backfillChannel(PHOTO_CHANNEL_ID, "media", { maxMessages: BACKFILL_MAX_MESSAGES });
    } catch (err) {
      console.error("[AUTO_REACT] erro no backfill do canal de mídia:", err);
    }

    try {
      await backfillChannel(ALL_MESSAGES_CHANNEL_ID, "all", { maxMessages: BACKFILL_MAX_MESSAGES });
    } catch (err) {
      console.error("[AUTO_REACT] erro no backfill do canal geral:", err);
    }

    console.log("[AUTO_REACT] backfill automático concluído.");
  }

  if (client.isReady()) {
    startAutoReactBackfill().catch((err) => {
      console.error("[AUTO_REACT] erro ao iniciar imediatamente:", err);
    });
  } else {
    client.once(Events.ClientReady, async () => {
      await startAutoReactBackfill();
    });
  }
}

// (daqui pra baixo mantém o resto do teu código específico do bot)
// ===================================================================



// call_bot.js (ESM)
// ———————————————————————————————————————————————————————————————
// Bot de call com:
// 1) auto-reconexão no canal de voz
// 2) frases aleatórias (entrada/saída/expulsão) com MUITAS variações + emojis
// 3) auto-delete de TODAS as mensagens após 30 minutos
// 4) antes de mandar "já está de volta…", apaga a anterior desse tipo
// 5) antes de mandar aviso de expulsão/queda, apaga o último aviso desse tipo
// 6) fala como "Amiguinho da SantaCreators"
// ———————————————————————————————————————————————————————————————
//
// Requisitos:
//   npm i discord.js @discordjs/voice dotenv
// .env (apenas linhas CHAVE=VALOR):
//   DISCORD_TOKEN=seu_token
//   VOICE_CHANNEL_ID=1415386915137388664
//   TEXT_CHANNEL_ID=1381597720007151698
// ———————————————————————————————————————————————————————————————


import path from 'path';


dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// ——— CONFIG ———
const VOICE_CHANNEL_ID = (process.env.VOICE_CHANNEL_ID || '1415386915137388664').trim();
const TEXT_CHANNEL_ID  = (process.env.TEXT_CHANNEL_ID  || '1381597720007151698').trim();

const CHECK_INTERVAL_MS = 60_000;            // checagem de presença no canal de voz
const LEAVE_DELAY_MS    = 4 * 60 * 1000;     // 4 minutos
const AUTO_DELETE_MS    = 30 * 60 * 1000;    // 30 minutos (apagamento automático)

// ——— TOKEN / CLIENT ———
const TOKEN = (process.env.DISCORD_TOKEN || process.env.TOKEN || '').trim();
if (!TOKEN) throw new Error('DISCORD_TOKEN/TOKEN ausente no .env');


// ——— ESTADO EM DISCO ———
const DB_PATH = path.join(__dirname, 'call_bot_state.json');
const state = (() => {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch {
    return {
      lastJoinMessageDay: {},
      pendingLeave: {},
      lastByType: {},     // última msg por "tipo" (statusReturn, kickNotice, etc.)
      pendingDeletes: [], // [{channelId, id, deleteAt}]
    };
  }
})();
function saveState(){ try{ fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2)); }catch{} }

// ——— HELPERS ———
function pick(a){ return Array.isArray(a) && a.length ? a[Math.floor(Math.random()*a.length)] : ''; }
function dayKey(d=new Date()){ return d.toISOString().slice(0,10); }
function clampStr(s){ return (s || '').replace(/\s+\n/g, '\n').trim(); }

// ———————————————————————————————————————————————————————————————
// GERADOR DE FRASES (muuuuitas variações com emojis)
// ———————————————————————————————————————————————————————————————
const NAME = 'Amiguinho da SantaCreators';
const SELF = 'o Amiguinho da SantaCreators';

const EMOJI = {
  happy:  ['😄','😁','🥳','✨','🎉','🎈','😎','🫶','🤝','🎧','🪩'],
  sad:    ['😢','🥲','💔','😞','🫠','🫥','🌧️','☔','🥀','🪫'],
  sassy:  ['😏','🙃','💅','😌','🗿','🛎️','🧃','🍪','🫡'],
  fear:   ['😨','😱','👀','🫣','🧟','🕳️','🫨','🌀'],
  demot:  ['🛌','🪫','🥱','😪','💤','📵','🧘','🍫'],
  neutral:['👋','🤖','📞','☎️','📡','🔔','📻','🎛️']
};

const CALL_WORDS = [
  'call', 'callzinha', 'cal', 'sala de áudio', 'voz', 'papo', 'barraco sonoro', 'rolê de voz'
];

const ENTRADA_OPEN = [
  'Cheguei na maciota', 'Presente', 'Toquei a campainha e entrei',
  'Pisei com estilo', 'Voltei da padaria', 'Entrei de fininho',
  'Pulei a janela do áudio', 'Teletransportei', 'Spawn de amiguinho concluído'
];

const ENTRADA_CORE = [
  'cadê meu povo bonito?', 'quem tá on pra fofoca?', 'vamos fazer história hoje?',
  'tá liberado o caos do bem?', 'bora esquentar essa callzinha?',
  'me prometem uma risada sincera?', 'tem café? se não tiver, eu trouxe biscoito',
  'fiquei com saudade de ouvir o teclado de vocês',
  'eu ouvi “live”? então é live', 'algum editor de vídeo por aqui ou só lendas?',
  'vim entregar companhia e memes de qualidade duvidosa',
  'o ambiente tá pronto pra brilhar', 'sextou no meu coração (mesmo que seja terça)'
];

const ENTRADA_TONES = [
  {tag:'feliz',    emojis:EMOJI.happy,  pre:['Aeeee','Uhuu','Êta nóis','Xablau'], post:['Que comece o show!','Eu amo esse lugar','Vocês são meu povo!']},
  {tag:'debochado',emojis:EMOJI.sassy,  pre:['Olha só','Ai, ai','Nem acredito','Glamour puro'], post:['Me tratem bem','Eu mereço tapete vermelho','Sem pressão, tá?']},
  {tag:'medo',     emojis:EMOJI.fear,   pre:['Silêncio estranho…','Ouvi passos…','Tem alguém aí?'], post:['Se alguém tossir eu corro','Não me deixem sozinho','A luz piscou ou fui eu?']},
  {tag:'triste',   emojis:EMOJI.sad,    pre:['Voltei cabisbaixo','Dia puxado…','Saudades antecipadas'], post:['Mas vocês me animam','Me abraça em áudio','Promete que fica?']},
  {tag:'desmot',   emojis:EMOJI.demot,  pre:['Zero energia','Café acabou','Tô em modo eco'], post:['Puxa tema leve','Fala devagar','Manda meme e passa pano']}
];

const SAIDA_OPEN = [
  'Eita, fuga detectada', 'E sumiu no breu', 'Escorregou pelo cabo do microfone',
  'Saiu de mansinho', 'Abandonou o barraco sonoro', 'Aperto de EJECT aplicado',
  'O vento levou', 'Quicou da sala', 'Deslogou da fofoca'
];

const SAIDA_CORE = [
  'mas a saudade ficou', 'as paredes sentiram falta', 'o silêncio aumentou 30%',
  'o gráfico de fofoca caiu', 'o KPI de risadas despencou',
  'a acústica chorou', 'promete voltar?', 'deixa o coração online, pelo menos',
  'o Amiguinho anota aqui que sentiu', 'fica o registro de carência sonora'
];

const SAIDA_TONES = [
  {tag:'feliz',    emojis:EMOJI.happy,  pre:['Valeu pela presença!','Volta logo!'], post:['Traz biscoito','A gente guarda seu lugar']},
  {tag:'triste',   emojis:EMOJI.sad,    pre:['Poxa…','Ai, que dor no tímpano'], post:['Vou sentir saudade','Sem você a call fica cinza']},
  {tag:'debochado',emojis:EMOJI.sassy,  pre:['Fugiu, né?','Correu do papo?'], post:['Tô de olho','Volta que a fofoca nem começou']},
  {tag:'medo',     emojis:EMOJI.fear,   pre:['Sumiu do nada…','Porta rangendo…'], post:['Isso foi um sinal?','Se cuida aí fora']},
  {tag:'desmot',   emojis:EMOJI.demot,  pre:['Ok, ok','Vida que segue'], post:['Vou deitar emocionalmente','Me chama quando tiver café']}
];

const KICK_OPEN = [
  'Alerta de drama', 'Momento novela das 8', 'Plot twist', 'Denúncia sonora',
  'Bug social', 'Queda livre', 'Chute metafórico', 'Desconexão astral',
  'O fio da internet tropeçou', 'O roteador pediu férias'
];

const KICK_CORE = [
  'tiraram o Amiguinho da SantaCreators da call',
  'o Amiguinho da SantaCreators foi expulso com elegância duvidosa',
  'o destino clicou em “Disconnect” por mim',
  'caí da escada do áudio, mas caio em pé',
  'a vida me derrubou, mas eu sou elástico',
  'me chutaram com carinho (mentira, doeu)',
  'o universo falou “sai” e eu obedeci',
  'o botão vermelho venceu',
  'o cabo de rede me deu uma rasteira',
  'a inveja bateu forte no meu ping'
];

const KICK_TONES = [
  {tag:'feliz',    emojis:[...EMOJI.happy, ...EMOJI.sassy], pre:['KKKK socorro','Eu volto já','Rindo de nervoso'], post:['Fiquem por perto','Me esperem com bolacha']},
  {tag:'triste',   emojis:EMOJI.sad,    pre:['Chorei baixo','Climinha tenso'], post:['Eu volto mais forte','Abraça o Amiguinho']},
  {tag:'debochado',emojis:EMOJI.sassy,  pre:['Quem ousa?','Olha a audácia'], post:['Eu sou inevitável','Anota esse nome']},
  {tag:'medo',     emojis:EMOJI.fear,   pre:['Barulho de passos…','Porta bateu sozinha'], post:['Se sumir, me procurem','Conjurem meu retorno']},
  {tag:'desmot',   emojis:EMOJI.demot,  pre:['A preguiça venceu','Tô sem moral'], post:['Mas eu tento de novo','Café resolve']}
];

const CALL_TO_ACTION = [
  'Quem segura essa call comigo?',
  'Abre o coração e o microfone.',
  'Hoje a gente entrega presença.',
  'Bora farmar minutos de amizade.',
  'Senta que lá vem história.',
  'Cola que é sucesso.',
  'Larga o mute e vem.',
  'Eu prometo 2% de juízo.',
  'Foco, força e fofoca.',
  'Meta: 7 risadas e 1 suspiro.'
];

const FECHOS = [
  'Ass: ' + NAME,
  'Com carinho, ' + NAME,
  '– ' + NAME,
  'Cordialmente nada, ' + NAME,
  NAME + ' reportando e brilhando',
  NAME + ' aprovou essa mensagem'
];

// ——— Funções de geração (milhares de combinações únicas) ———
function genEntrada(userId) {
  const tone  = pick(ENTRADA_TONES);
  const emj   = pick(tone.emojis);
  const open  = pick(ENTRADA_OPEN);
  const core  = pick(ENTRADA_CORE);
  const pre   = pick(tone.pre);
  const post  = pick(tone.post);
  const cta   = pick(CALL_TO_ACTION);
  const fecho = pick(FECHOS);

  const linha1 = `${emj} ${pre}. ${open}.`;
  const linha2 = `${emj} ${SELF} chegou perguntando: **${core}**`;
  const linha3 = `${cta} <@${userId}>`;
  const linha4 = `${post}. ${pick(EMOJI.neutral)} ${fecho}`;

  return clampStr(`${linha1}\n${linha2}\n${linha3}\n${linha4}`);
}

function genSaida(userId) {
  const tone  = pick(SAIDA_TONES);
  const emj   = pick(tone.emojis);
  const open  = pick(SAIDA_OPEN);
  const core  = pick(SAIDA_CORE);
  const pre   = pick(tone.pre);
  const post  = pick(tone.post);
  const fecho = pick(FECHOS);

  const linha1 = `${emj} ${open}. <@${userId}> saiu da ${pick(CALL_WORDS)}…`;
  const linha2 = `${emj} ${pre} — ${core}.`;
  const linha3 = `${post}. ${fecho}`;

  return clampStr(`${linha1}\n${linha2}\n${linha3}`);
}

function genKick(executorId /* pode ser undefined */) {
  const tone  = pick(KICK_TONES);
  const emj   = pick(tone.emojis);
  const open  = pick(KICK_OPEN);
  const core  = pick(KICK_CORE);
  const pre   = pick(tone.pre);
  const post  = pick(tone.post);
  const fecho = pick(FECHOS);

  const quem = executorId ? `\nDenúncia: <@${executorId}> apertou o botão misterioso.` : '';
  const linha1 = `${emj} ${open}! ${pre}.`;
  const linha2 = `${emj} **${core}**. ${post}.`;
  const linha3 = `${pick(EMOJI.neutral)} Já já eu volto, confia. ${fecho}`;

  return clampStr(`${linha1}\n${linha2}${quem}\n${linha3}`);
}

// “arrays virtuais” para manter compat com pick(…) antigo (apenas referência)
const JOIN_MESSAGES = { sizeHint: 200, generate: genEntrada };
const LEAVE_MESSAGES = { sizeHint: 200, generate: genSaida };
const KICK_MESSAGES  = { sizeHint: 200, generate: genKick };

// ——— GERENCIAMENTO DE MENSAGENS (auto-delete e substituição por tipo) ———
async function deleteMessageById(channelId, messageId){
  if (!channelId || !messageId) return false;
  try{
    const ch = await client.channels.fetch(channelId).catch(()=>null);
    if (!ch || !ch.messages) return false;
    const msg = await ch.messages.fetch(messageId).catch(()=>null);
    if (!msg) return false;
    await msg.delete().catch(()=>{});
    return true;
  }catch{ return false; }
}

function scheduleDeletion(channelId, messageId, delayMs = AUTO_DELETE_MS){
  const deleteAt = Date.now() + delayMs;
  state.pendingDeletes = state.pendingDeletes || [];
  state.pendingDeletes.push({ channelId, id: messageId, deleteAt });
  saveState();
}

async function runPendingDeletionsSweep(){
  const now = Date.now();
  const list = state.pendingDeletes || [];
  if (!list.length) return;
  const keep = [];
  for (const item of list){
    if (!item || typeof item.deleteAt !== 'number' || !item.id) continue;
    if (item.deleteAt <= now){
      await deleteMessageById(item.channelId || TEXT_CHANNEL_ID, item.id);
    } else {
      keep.push(item);
    }
  }
  state.pendingDeletes = keep;
  saveState();
}

// Envia texto e agenda auto-delete; se "type" vier, apaga a última desse tipo antes
async function sendTextManaged(content, type /* ex.: "statusReturn" | "kickNotice" */){
  try{
    const ch = await client.channels.fetch(TEXT_CHANNEL_ID).catch(()=>null);
    if (!ch) return;

    if (type){
      state.lastByType = state.lastByType || {};
      const prevId = state.lastByType[type];
      if (prevId){
        await deleteMessageById(TEXT_CHANNEL_ID, prevId);
        state.pendingDeletes = (state.pendingDeletes || []).filter(x => x.id !== prevId);
      }
    }

    const sent = await ch.send(content);
    if (type){
      state.lastByType[type] = sent.id;
    }
    scheduleDeletion(TEXT_CHANNEL_ID, sent.id, AUTO_DELETE_MS);
    saveState();
  }catch(e){
    console.error('[text-managed]', e?.message || e);
  }
}

// Compat simples
async function sendText(msg){
  return sendTextManaged(msg);
}

// ——— CONEXÃO AO CANAL DE VOZ ———
async function connectToVoice() {
  try {
    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
    const isVoice = channel && (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    if (!isVoice) throw new Error('Canal de voz inválido');

    const conn = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    conn.on('stateChange', (o,n) => {
      if (n.status === VoiceConnectionStatus.Disconnected || n.status === VoiceConnectionStatus.Destroyed) {
        setTimeout(() => connectToVoice().catch(()=>{}), 1500);
      }
    });

    try { await entersState(conn, VoiceConnectionStatus.Ready, 10_000); } catch {}
    return true;
  } catch (e) {
    console.error('[voice] erro ao conectar:', e?.message || e);
    return false;
  }
}

async function ensureInCall(){
  const channel = await client.channels.fetch(VOICE_CHANNEL_ID).catch(()=>null);
  const inChannel = channel && channel.members?.has(client.user.id);
  if (!inChannel) {
    const ok = await connectToVoice();
    if (ok) {
      // Antes de mandar o “já está de volta…”, apaga a anterior desse tipo:
      await sendTextManaged('🎧 O amigo deles **já está de volta**!! Quer companhia pra ficar na call? Alguém disponível?', 'statusReturn');
    }
  }
}

// ——— READY ———
client.once(Events.ClientReady, async () => {
  console.log(`[ready] Logado como ${client.user.tag}`);

  // se reiniciou, limpa o que venceu
  await runPendingDeletionsSweep();

  await ensureInCall();
  setInterval(ensureInCall, CHECK_INTERVAL_MS);

  // varredura das pendências de deleção
  setInterval(runPendingDeletionsSweep, 60_000);
});

// ——— ENTRADA/SAÍDA/EXPULSÃO ———
const timers = new Map();
function canSendJoinFor(uid){
  const dk = dayKey();
  return (state.lastJoinMessageDay?.[uid] ?? '') !== dk;
}
function markSentJoin(uid){
  state.lastJoinMessageDay = state.lastJoinMessageDay || {};
  state.lastJoinMessageDay[uid] = dayKey();
  saveState();
}

client.on(Events.VoiceStateUpdate, async (oldS, newS) => {
  // BOT EXPULSO / CAIU (do VOICE_CHANNEL_ID)
  if (oldS.member?.id === client.user.id && oldS.channelId === VOICE_CHANNEL_ID && newS.channelId !== VOICE_CHANNEL_ID) {
    setTimeout(async () => {
      try {
        const logs = await newS.guild.fetchAuditLogs({ type: AuditLogEvent.MemberDisconnect, limit: 5 });
        const entry = logs.entries.find(e => e?.target?.id === client.user.id && (Date.now() - e.createdTimestamp) < 15_000);
        if (entry) {
          await sendTextManaged(genKick(entry.executor?.id), 'kickNotice');
        } else {
          await sendTextManaged(genKick(), 'kickNotice');
        }
      } catch {
        await sendTextManaged(genKick(), 'kickNotice');
      }
    }, 1500);
  }

  const wasIn = oldS.channelId === VOICE_CHANNEL_ID;
  const isIn  = newS.channelId === VOICE_CHANNEL_ID;
  const userId = newS.member?.id || oldS.member?.id;
  if (!userId || userId === client.user.id) return;

  // ENTRADA de usuário
  if (!wasIn && isIn) {
    const t = timers.get(userId);
    if (t) { clearTimeout(t); timers.delete(userId); if (state.pendingLeave) delete state.pendingLeave[userId]; saveState(); }
    if (canSendJoinFor(userId)) {
      await sendText(genEntrada(userId) + `\nObrigadinh@ pela presença, <@${userId}>.`);
      markSentJoin(userId);
    }
  }

  // SAÍDA de usuário (delay 4 min com cancelamento)
  if (wasIn && !isIn) {
    const prev = timers.get(userId);
    if (prev) clearTimeout(prev);
    const to = setTimeout(async () => {
      try {
        const ch = await client.channels.fetch(VOICE_CHANNEL_ID).catch(()=>null);
        const stillOut = ch ? !ch.members.has(userId) : true;
        if (stillOut) {
          await sendText(genSaida(userId));
        }
      } finally {
        timers.delete(userId);
        if (state.pendingLeave) delete state.pendingLeave[userId];
        saveState();
      }
    }, LEAVE_DELAY_MS);
    timers.set(userId, to);
    state.pendingLeave = state.pendingLeave || {};
    state.pendingLeave[userId] = Date.now() + LEAVE_DELAY_MS;
    saveState();
  }
});







(async () => {

    // --------------------------------
  // CONFIG POR SERVIDOR (GUILD)
  // --------------------------------
  const PS2_CONFIG = {
    // DC NOVO
    '1379642886269964358': {
      buttonChannelId: '1379643450273566763', // menu / registro pedir set
      logChannelId: '1379643767245766760',    // aprovar / reprovar

      roleSetId: '1379643216491708518',       // santa creators
      roleInterviewId: '1379643291695579178', // entrevista (remove)

      approvalRoleIds: [
        '1379643208774193202', // mkt ticket
        '1435593149895409785', // resp creators
        '1379643204802052247', // resp influ
        '1379643205980655769', // resp lider
        '1379643197822730261'  // owner
      ],

      // quem pode usar !pedirset (se vazio -> ManageGuild)
      commandRoleIds: [
        '1379643208774193202',
        '1435593149895409785',
        '1379643204802052247',
        '1379643205980655769',
        '1379643197822730261'
      ]
    },

    // DC ANTIGO (mantém o menu antigo)
    '1262262852782129183': {
      buttonChannelId: 'ENVIAR AQUI PARA DC SANTA CREATORS OFC',
      logChannelId: '1352706078621696030',

      roleSetId: '1352275728476930099',
      roleInterviewId: '1353797415488196770',

      // seus cargos antigos (mantive os que você tinha)
      approvalRoleIds: [
        '660311795327828008',
        '1262262852949905408',
        '1352408327983861844',
        '1262262852949905409',
        '1352407252216184833',
        '1352385500614234134',
        '1282119104576098314',
        '1372716303122567239'
      ],
      commandRoleIds: [
        '660311795327828008',
        '1262262852949905408',
        '1352408327983861844',
        '1262262852949905409',
        '1352407252216184833'
      ]
    }
  };

  // --------------------------------
  // ESTADO POR GUILD (não mistura)
  // --------------------------------
  const PS2_pedidosByGuild = new Map();       // guildId -> Map(id -> dados)
  const PS2_buttonMsgIdByGuild = new Map();   // guildId -> messageId do menu
  const PS2_limpezaIntervalByGuild = new Map();
  const PS2_onceMemo = new Map();             // throttle

  function PS2_getCfg(guildId) {
    return PS2_CONFIG[guildId] || null;
  }

  function PS2_getPedidosMap(guildId) {
    if (!PS2_pedidosByGuild.has(guildId)) PS2_pedidosByGuild.set(guildId, new Map());
    return PS2_pedidosByGuild.get(guildId);
  }

  async function PS2_safeReply(message, content) {
    try {
      return await message.reply({ content });
    } catch {
      try { return await message.channel.send({ content }); } catch {}
    }
  }

  async function PS2_fetchChannel(client, channelId) {
    if (!channelId) return null;
    try { return await client.channels.fetch(channelId); } catch { return null; }
  }

  async function PS2_onceIn(key, ms, fn) {
    const now = Date.now();
    const last = PS2_onceMemo.get(key) || 0;
    if (now - last < ms) return;
    PS2_onceMemo.set(key, now);
    return fn();
  }

  function PS2_isTextChannel(ch) {
    if (!ch) return false;
    // aceita Text / Announcement / Thread (mas menu ideal é canal normal)
    return (
      ch.type === ChannelType.GuildText ||
      ch.type === ChannelType.GuildAnnouncement ||
      ch.isTextBased?.()
    );
  }

  // --------------------------------
  // CRIA / RECRIA MENU DO BOTÃO
  // --------------------------------
  async function PS2_sendMenu(client, channel, guildId) {
    // apaga menus antigos desse guild (pra não duplicar)
    const msgs = await channel.messages.fetch({ limit: 30 }).catch(() => null);
    if (msgs) {
      const oldMenus = msgs.filter(m =>
        m.author?.id === client.user.id &&
        m.components?.length &&
        m.components[0]?.components?.some(c => c.customId === `ps2_abrir_${guildId}`)
      );
      for (const [, m] of oldMenus) await m.delete().catch(() => {});
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ps2_abrir_${guildId}`)
        .setLabel('📋 Pedir Set SantaCreators')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle('📥 Pedir Set Oficial – SantaCreators')
      .setDescription(
        'Clique no botão abaixo para solicitar oficialmente seu set na SantaCreators! 💼\n\n' +
        '⚠️ Você deve estar com sua entrevista aprovada.'
      )
      .setImage('https://media.discordapp.net/attachments/1362477839944777889/1380979949816643654/standard_2r.gif')
      .setColor('#ff3399');

    const sent = await channel.send({ embeds: [embed], components: [row] });
    PS2_buttonMsgIdByGuild.set(guildId, sent.id);
    return sent;
  }

  // --------------------------------
  // LIMPEZA DO CANAL DO MENU
  // mantém só o botão + fixadas + msgs do bot
  // --------------------------------
  async function PS2_startLimpeza(client, channel, guildId) {
    const old = PS2_limpezaIntervalByGuild.get(guildId);
    if (old) clearInterval(old);

    const interval = setInterval(async () => {
      await PS2_onceIn(`ps2_limpeza_${guildId}`, 10 * 60_000, async () => {
        try {
          const me = channel.guild.members.me;
          if (!me?.permissionsIn(channel).has(PermissionFlagsBits.ManageMessages)) return;

          const msgs = await channel.messages.fetch({ limit: 25 }).catch(() => null);
          if (!msgs) return;

          const btnId = PS2_buttonMsgIdByGuild.get(guildId);
          const exists = btnId && msgs.has(btnId) ? msgs.get(btnId) : null;

          if (!exists) {
            const newMsg = await PS2_sendMenu(client, channel, guildId);
            msgs.set(newMsg.id, newMsg);
          }

          const btnId2 = PS2_buttonMsgIdByGuild.get(guildId);

          const toDelete = msgs.filter(m =>
            m.id !== btnId2 &&
            !m.pinned &&
            m.author?.id !== client.user.id
          );

          for (const [, m] of toDelete) await m.delete().catch(() => {});
        } catch {}
      });
    }, 10_000);

    PS2_limpezaIntervalByGuild.set(guildId, interval);
  }

  // --------------------------------
  // AO LIGAR: envia menus pros guilds
  // --------------------------------
  client.once(Events.ClientReady, async () => {
    console.log(`[PEDIRSET] Online como ${client.user.tag}`);

    for (const guildId of Object.keys(PS2_CONFIG)) {
      const cfg = PS2_getCfg(guildId);
      if (!cfg?.buttonChannelId) continue;

      const ch = await PS2_fetchChannel(client, cfg.buttonChannelId);
      if (!PS2_isTextChannel(ch)) {
        console.warn(`[PEDIRSET] Canal do menu inválido no guild ${guildId}: ${cfg.buttonChannelId}`);
        continue;
      }

      // garante que o canal é do guild certo
      if (ch.guild?.id !== guildId) {
        console.warn(`[PEDIRSET] O canal ${cfg.buttonChannelId} não pertence ao guild ${guildId}`);
        continue;
      }

      try {
        await PS2_sendMenu(client, ch, guildId);
        await PS2_startLimpeza(client, ch, guildId);
        console.log(`[PEDIRSET] Menu enviado no guild ${guildId} -> #${ch.name}`);
      } catch (e) {
        console.warn(`[PEDIRSET] Falha ao enviar menu no guild ${guildId}:`, e?.message || e);
      }
    }
  });

  // --------------------------------
  // COMANDO: !pedirset
  // --------------------------------
  client.on(Events.MessageCreate, async (message) => {
    if (!message.guild) return;
    if (message.author?.bot) return;

    const content = (message.content || '').toLowerCase();
    if (!content.startsWith('!pedirset')) return;

    const cfg = PS2_getCfg(message.guild.id);
    if (!cfg?.buttonChannelId) {
      return PS2_safeReply(message, '❌ Esse servidor não tá configurado pro pedir set.');
    }

    let canUse = false;
    if (cfg.commandRoleIds?.length) {
      canUse = message.member?.roles?.cache?.some(r => cfg.commandRoleIds.includes(r.id));
    } else {
      canUse = message.member?.permissions?.has(PermissionFlagsBits.ManageGuild);
    }

    if (!canUse) return PS2_safeReply(message, '❌ Você não tem permissão para usar esse comando.');

    const ch = await PS2_fetchChannel(client, cfg.buttonChannelId);
    if (!PS2_isTextChannel(ch)) return PS2_safeReply(message, '❌ Canal do menu não encontrado ou inválido.');
    if (ch.guild?.id !== message.guild.id) return PS2_safeReply(message, '❌ Canal configurado não pertence a esse servidor.');

    try {
      await PS2_sendMenu(client, ch, message.guild.id);
      await PS2_startLimpeza(client, ch, message.guild.id);
      await PS2_safeReply(message, '✅ Botão de Set enviado/atualizado com sucesso.');
    } catch (e) {
      console.warn('[PEDIRSET] Erro no comando !pedirset:', e?.message || e);
      await PS2_safeReply(message, '❌ Deu erro ao enviar o menu. Confere permissões do bot nesse canal.');
    }
  });

  // --------------------------------
  // INTERAÇÕES: botão + modal + aprovar/reprovar
  // --------------------------------
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.guild) return;

    const guildId = interaction.guild.id;
    const cfg = PS2_getCfg(guildId);
    if (!cfg) return;

    // ---- BOTÃO ABRIR MODAL
    if (interaction.isButton() && interaction.customId === `ps2_abrir_${guildId}`) {
      const modal = new ModalBuilder()
        .setCustomId(`ps2_form_${guildId}`)
        .setTitle('📋 Solicitação de Set SantaCreators')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('nome_ingame')
              .setLabel('Seu Nome EM GAME:')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('id_passaporte')
              .setLabel('Seu ID/Passaporte EM GAME:')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('alinhado_ticket')
              .setLabel('Quem te alinhou via ticket?')
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('indicacao')
              .setLabel('Veio por alguma indicação?')
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('zipzap')
              .setLabel('Seu número do ZipZap (do game):')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );

      try { await interaction.showModal(modal); } catch {}
      return;
    }

    // ---- MODAL SUBMIT
    if (interaction.isModalSubmit() && interaction.customId === `ps2_form_${guildId}`) {
      await interaction.deferReply({ ephemeral: true }).catch(() => {});

      const logCh = await PS2_fetchChannel(client, cfg.logChannelId);
      if (!PS2_isTextChannel(logCh) || logCh.guild?.id !== guildId) {
        return interaction.followUp({ content: '❌ Canal de log não encontrado/config errado.', ephemeral: true }).catch(() => {});
      }

      const nome = interaction.fields.getTextInputValue('nome_ingame');
      const passaporte = interaction.fields.getTextInputValue('id_passaporte');
      const alinhado = interaction.fields.getTextInputValue('alinhado_ticket') || 'N/A';
      const indicacao = interaction.fields.getTextInputValue('indicacao') || 'N/A';
      const zipzap = interaction.fields.getTextInputValue('zipzap');

      const idUnico = `${guildId}_${Date.now()}_${interaction.user.id}`;
      const pedidos = PS2_getPedidosMap(guildId);

      pedidos.set(idUnico, {
        userId: interaction.user.id,
        nome,
        passaporte,
        alinhado,
        indicacao,
        zipzap
      });

      const embed = new EmbedBuilder()
        .setTitle('📋 Novo Pedido de Set Recebido')
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription([
          `**🏰 Servidor:** ${interaction.guild.name}`,
          `**👤 Usuário:** <@${interaction.user.id}>`,
          `**📛 Nome In Game:** ${nome}`,
          `**🆔 Passaporte:** ${passaporte}`,
          `**🎯 Alinhado por:** ${alinhado}`,
          `**📣 Indicação:** ${indicacao}`,
          `**📞 ZipZap:** ${zipzap}`
        ].join('\n'))
        .setImage('https://media.discordapp.net/attachments/1362477839944777889/1380979949816643654/standard_2r.gif')
        .setColor('#00ffcc')
        .setFooter({ text: `Pedido feito por ${interaction.user.tag}` })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`ps2_aprovar_${idUnico}`)
          .setLabel('✅ Aprovar Set')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`ps2_reprovar_${idUnico}`)
          .setLabel('❌ Reprovar Set')
          .setStyle(ButtonStyle.Danger)
      );

      await logCh.send({ embeds: [embed], components: [row] }).catch(() => {});

      return interaction.followUp({ content: '✅ Pedido enviado com sucesso!', ephemeral: true }).catch(() => {});
    }

    // ---- APROVAR
    if (interaction.isButton() && interaction.customId.startsWith('ps2_aprovar_')) {
      const idUnico = interaction.customId.replace('ps2_aprovar_', '');
      const pedidos = PS2_getPedidosMap(guildId);
      const dados = pedidos.get(idUnico);

      if (!dados) return interaction.reply({ content: '❌ Dados não encontrados.', ephemeral: true }).catch(() => {});

      const canApprove = cfg.approvalRoleIds?.length
        ? cfg.approvalRoleIds.some(rid => interaction.member.roles.cache.has(rid))
        : interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);

      if (!canApprove) return interaction.reply({ content: '❌ Sem permissão pra aprovar.', ephemeral: true }).catch(() => {});

      const { userId, nome, passaporte } = dados;

      const member = await interaction.guild.members.fetch(userId).catch(() => null);
      if (!member) return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true }).catch(() => {});

      if (cfg.roleSetId) await member.roles.add(cfg.roleSetId).catch(() => {});
      if (cfg.roleInterviewId) await member.roles.remove(cfg.roleInterviewId).catch(() => {});
      await member.setNickname(`SC | ${nome} | ${passaporte}`).catch(() => {});

      const base = interaction.message.embeds?.[0]
        ? EmbedBuilder.from(interaction.message.embeds[0])
        : new EmbedBuilder().setTitle('📋 Pedido de Set');

      const edited = base
        .setColor('Green')
        .setFooter({ text: `✅ Aprovado por ${interaction.user.tag}` });

      const rowDone = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ps2_done_aprovado')
          .setLabel('✅ Set Aprovado')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      await interaction.update({ embeds: [edited], components: [rowDone] }).catch(async () => {
        try { await interaction.reply({ content: '✅ Aprovado, mas não consegui editar a msg.', ephemeral: true }); } catch {}
      });

      await member.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎉 SET APROVADO COM SUCESSO! 🎉')
            .setDescription([
              'Parabéns! Seu set na **SantaCreators** foi oficialmente **aprovado** ✅',
              '',
              'Agora, vá até o ticket onde fez sua entrevista e diga quando poderá fazer a **contratação in game**.',
              '',
              'Se tiver dúvidas, fale com a staff! 👥'
            ].join('\n'))
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage('https://media.discordapp.net/attachments/1362477839944777889/1380979949816643654/standard_2r.gif')
            .setColor('#00cc99')
            .setFooter({ text: 'SantaCreators • Organização Oficial' })
        ]
      }).catch(() => {});

      // se quiser limpar depois:
      // pedidos.delete(idUnico);

      return;
    }

    // ---- REPROVAR
    if (interaction.isButton() && interaction.customId.startsWith('ps2_reprovar_')) {
      const idUnico = interaction.customId.replace('ps2_reprovar_', '');
      const pedidos = PS2_getPedidosMap(guildId);
      const dados = pedidos.get(idUnico);

      if (!dados) return interaction.reply({ content: '❌ Dados não encontrados.', ephemeral: true }).catch(() => {});

      const canReject = cfg.approvalRoleIds?.length
        ? cfg.approvalRoleIds.some(rid => interaction.member.roles.cache.has(rid))
        : interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);

      if (!canReject) return interaction.reply({ content: '❌ Sem permissão pra reprovar.', ephemeral: true }).catch(() => {});

      const base = interaction.message.embeds?.[0]
        ? EmbedBuilder.from(interaction.message.embeds[0])
        : new EmbedBuilder().setTitle('📋 Pedido de Set');

      const edited = base
        .setColor('Red')
        .setFooter({ text: `❌ Reprovado por ${interaction.user.tag}` });

      const rowDone = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ps2_done_reprovado')
          .setLabel('❌ Set Reprovado')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      await interaction.update({ embeds: [edited], components: [rowDone] }).catch(async () => {
        try { await interaction.reply({ content: '❌ Reprovado, mas não consegui editar a msg.', ephemeral: true }); } catch {}
      });

      pedidos.delete(idUnico);
      return;
    }
  });
})();
////QUizz diarios

// ===============================
// SANTA CREATORS — QUIZ DIÁRIO 📚
// ===============================
// • Posta 1 quiz/dia em horário aleatório no canal Creators.
// • Quem responder por REPLY tem a resposta apagada e recebe +3 perguntas no PV.
// • 3 min por pergunta no PV (timeout encerra a rodada).
// • Ranking público (acertos, erros, interações) com sticky message.
// • Logs detalhados em canal próprio (quem respondeu, certo/errado, etc.).
// • Variáveis isoladas com prefixo SC_QUIZ_ e guarda global pra não duplicar.
// • Não usa import/require extra (usa payload cru de embed).

(async () => {
  try {
    if (!globalThis.client) {
      console.warn("[SC_QUIZ] client global não encontrado. Cole este bloco DEPOIS de criar o client do Discord.");
      return;
    }
    if (client.__SC_QUIZ_INSTALLED) {
      console.log("[SC_QUIZ] Já instalado, pulando.");
      return;
    }
    client.__SC_QUIZ_INSTALLED = true;

   // ========== CONFIG ==========
const SC_QUIZ_CREATORS_CHANNEL_ID = '1381597720007151698';   // onde aparece a pergunta diária
const SC_QUIZ_RANKING_CHANNEL_ID  = '1415387000416243722';   // ranking público
const SC_QUIZ_LOGS_CHANNEL_ID     = '1415390219779313808';   // logs internos
const SC_MENTION_ROLES = ['1262978759922028575','1352275728476930099'];


// 📚 DIÁRIO
const SC_QUIZ_DAILY_COUNT         = 10; // envia no MÁXIMO 10 por dia
const SC_QUIZ_WINDOW_START_HOUR   = 10;           // começa mais cedo (BRT)
const SC_QUIZ_WINDOW_END_HOUR     = 22;           // termina mais tarde
const SC_QUIZ_MIN_GAP_MINUTES     = 25;          // novo: espaçamento mínimo entre quizzes do dia
const SC_QUIZ_DM_TIMEOUT_MS       = 3 * 60 * 1000; // 3 min por pergunta no PV
const SC_QUIZ_EXTRA_DM_QUESTIONS  = 3;            // perguntas extras no PV
const SC_QUIZ_DATA_PATH           = './sc_quiz_data.json';
const SC_QUIZ_POINTS_RIGHT        = 1;
const SC_QUIZ_POINTS_WRONG        = 0;

// =================== FAST QUIZ (RELÂMPAGO) — CONFIG ===================
// Modo cadência fixa: posta 1 relâmpago a cada N minutos durante a janela
const SC_RT_EVERY_MINUTES         = 30; // meia hora
           // define a frequência (min). Ponha 0 para desativar

// Se SC_RT_EVERY_MINUTES = 0, cai no modo “X por dia” abaixo:
const SC_RT_DAILY_COUNT           = 15;           // usado só quando SC_RT_EVERY_MINUTES = 0

const SC_RT_WINDOW_START_HOUR     = 12;           // mesma janela do diário
const SC_RT_WINDOW_END_HOUR       = 23;
const SC_RT_ACTIVE_TIMEOUT_MS     = 3 * 60 * 1000; // antes 5 min — agora 3 min (encerra sozinho)


    // GIF solicitado (nome único p/ não conflitar):
    const GIF_QUIIZ_URL = 'https://media.discordapp.net/attachments/1362477839944777889/1374893068649500783/standard_1.gif?ex=68c2b3b3&is=68c16233&hm=fb2088e9693479fdae08076fc482855004e662ed1a788e7b9788eff44b1c7dd6&=&width=1032&height=60';

    // ======= DEPENDÊNCIAS NATIVAS — ESM SAFE ========
       const fs = await import('node:fs'); // agora fs.existsSync / fs.readFileSync / fs.writeFileSync funcionam

// Node < 18: polyfill fetch (usado no scq_buildChartAttachment / QuickChart)
if (typeof fetch === 'undefined') {
  const { fetch: undiciFetch } = await import('undici');
  globalThis.fetch = undiciFetch;
}

    // ========= ESTADO/PERSISTÊNCIA =========
   let SC_QUIZ_STATE = {
  leaderboard: {},
  activeQuizMessages: [],
  // ↓ agora temos DOIS stickies separados
  stickyRankingMsgIdAcertos: null,
  stickyRankingMsgIdInteracoes: null,
  participantsByMsg: {},
  lastScheduleDayKey: null,
  __todaySchedule: [],

  // mensagem atual do quiz no canal creators
  currentQuizChannelMessageId: null,

  // última mensagem pública de feedback (parabéns / incorreta / encerrado)
  lastPublicFeedbackMessageId: null
};


    // Campos da modalidade relâmpago (persistem junto do estado principal)
SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {
  __todayScheduleFast: [],
  lastScheduleDayKeyFast: null,
  active: null,
  attempts: {}             // 1 tentativa por relâmpago
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

// 🔧 Garante que os campos existem mesmo se o JSON antigo não tiver todos
(function scq_normalizeState() {
  SC_QUIZ_STATE = SC_QUIZ_STATE || {};
SC_QUIZ_STATE.leaderboard = SC_QUIZ_STATE.leaderboard || {};
SC_QUIZ_STATE.activeQuizMessages = SC_QUIZ_STATE.activeQuizMessages || [];
SC_QUIZ_STATE.participantsByMsg = SC_QUIZ_STATE.participantsByMsg || {};
SC_QUIZ_STATE.__todaySchedule = SC_QUIZ_STATE.__todaySchedule || [];

// ========= ESTADO/PERSISTÊNCIA ========= (logo depois do SC_QUIZ_STATE ser criado)
SC_QUIZ_STATE.currentValidMessageId = SC_QUIZ_STATE.currentValidMessageId || null; // msg “oficial” (daily OU fast)
SC_QUIZ_STATE.currentSatisfied      = SC_QUIZ_STATE.currentSatisfied ?? true;     // true = pode postar outro

// mensagem atual do quiz no canal creators
SC_QUIZ_STATE.currentQuizChannelMessageId = SC_QUIZ_STATE.currentQuizChannelMessageId || null;

// última mensagem pública de feedback
SC_QUIZ_STATE.lastPublicFeedbackMessageId = SC_QUIZ_STATE.lastPublicFeedbackMessageId || null;

  SC_QUIZ_STATE.activity = SC_QUIZ_STATE.activity || {};
SC_QUIZ_STATE.activity.counter = SC_QUIZ_STATE.activity.counter || 0;
SC_QUIZ_STATE.activity.threshold = SC_QUIZ_STATE.activity.threshold || 30;

  
// novos campos para 2 mensagens “sticky”
if (!('stickyRankingMsgIdAcertos' in SC_QUIZ_STATE)) SC_QUIZ_STATE.stickyRankingMsgIdAcertos = null;
if (!('stickyRankingMsgIdInteracoes' in SC_QUIZ_STATE)) SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = null;

SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
SC_QUIZ_STATE.rt.__todayScheduleFast = SC_QUIZ_STATE.rt.__todayScheduleFast || [];
SC_QUIZ_STATE.rt.lastScheduleDayKeyFast =
  (typeof SC_QUIZ_STATE.rt.lastScheduleDayKeyFast === 'string' || SC_QUIZ_STATE.rt.lastScheduleDayKeyFast === null)
    ? SC_QUIZ_STATE.rt.lastScheduleDayKeyFast
    : null;
SC_QUIZ_STATE.rt.active = SC_QUIZ_STATE.rt.active || null;
SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};

})();


    // ======= BANCO DE PERGUNTAS =======
    // Formato: { id, categoria, texto, opcoes: ['A) ...','B) ...',...], resposta: 'A' }
    // Você pode adicionar MUITO mais. Já deixei um pack grande e variado.
   const SC_QUIZ_BANK = (() => {
  let idc = 1;
  const Q = [];

  const L = ['A', 'B', 'C', 'D'];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  let nextLetterIdx = 0;
  const rotateLetter = () => {
    const t = nextLetterIdx;
    nextLetterIdx = (nextLetterIdx + 1) % 4;
    return t;
  };

  const compact = (s) => {
    let out = String(s || '').trim().replace(/\s+/g, ' ');
    if (out.length > 84) out = out.slice(0, 81) + '...';
    return out;
  };

  function addS(categoria, texto, choices, correctIndex) {
    const idx = [0, 1, 2, 3];
    const perm = shuffle(idx);

    const targetLetterIdx = rotateLetter();
    const posCorrect = perm.indexOf(correctIndex);

    if (posCorrect !== targetLetterIdx) {
      [perm[posCorrect], perm[targetLetterIdx]] = [perm[targetLetterIdx], perm[posCorrect]];
    }

    const opcoes = perm.map((i, k) => `${L[k]}) ${compact(choices[i])}`);
    const resposta = L[targetLetterIdx];

    Q.push({
      id: idc++,
      categoria,
      texto,
      opcoes,
      resposta
    });
  }

  // =========================
  // REGRAS GERAIS / CONDUTA
  // =========================
  addS('Conduta', 'O que a SantaCreators espera de quem faz parte da equipe?', [
    'Só presença em call',
    'Respeito, postura e consciência',
    'Apenas saber usar comandos',
    'Somente foco em ganhar pontos'
  ], 1);

  addS('Conduta', 'A entrevista serve principalmente para:', [
    'Só preencher formulário',
    'Liberar cargo automático',
    'Ver se a pessoa veste a camisa de verdade',
    'Escolher a cidade favorita'
  ], 2);

  addS('Conduta', 'Problemas da empresa devem ser resolvidos como?', [
    'Por DM com qualquer pessoa',
    'Nos canais corretos e com organização',
    'Somente em conversa fora do RP',
    'No privado com membros comuns'
  ], 1);

  addS('Conduta', 'A hierarquia dentro da SantaCreators é vista como:', [
    'Decoração sem função real',
    'Estrutura com função e responsabilidade',
    'Algo opcional para quem quiser',
    'Somente um detalhe visual'
  ], 1);

  addS('Conduta', 'Cada membro possui um canal privado com seu nome para:', [
    'Criar tretas em sigilo',
    'Resolver tudo sem liderança',
    'Tirar dúvidas e pedir ajuda com segurança',
    'Falar apenas de assuntos pessoais'
  ], 2);

  addS('Conduta', 'Qual destas atitudes pode gerar expulsão mesmo se foi "brincadeira"?', [
    'Zoar roupa de evento',
    'Chegar atrasado uma vez',
    'Falar pouco na call',
    'Racismo, homofobia ou transfobia'
  ], 3);

  addS('Conduta', 'Se você decidir sair da SantaCreators, o procedimento correto é:', [
    'Remover o set sozinho no painel',
    'Pedir demissão em game para a equipe',
    'Mandar DM e sumir',
    'Sair do Discord sem avisar'
  ], 1);

  addS('Conduta', 'A idade mínima permitida para participar da SantaCreators é:', [
    '13 anos',
    '14 anos',
    '15 anos',
    '16 anos'
  ], 2);

  addS('Conduta', 'Familiares podem atuar juntos na equipe?', [
    'Sim, sem restrição',
    'Só se forem da mesma cidade',
    'Só com cargo baixo',
    'Não, por questões éticas e organizacionais'
  ], 3);

  addS('Conduta', 'Se houver vínculo familiar com alguém da equipe, o correto é:', [
    'Esconder para evitar confusão',
    'Avisar imediatamente a liderança responsável',
    'Esperar alguém descobrir',
    'Falar somente com membros comuns'
  ], 1);

  // =========================
  // IMERSÃO / RP
  // =========================
  addS('Imersão', 'No meio do RP, falar "meu Discord caiu" é:', [
    'Permitido se for rápido',
    'Aceitável em evento',
    'Quebra de imersão',
    'Obrigatório para explicar bug'
  ], 2);

  addS('Imersão', 'Se ocorrer bug ou alguém estiver flutuando, o mais correto é:', [
    'Quebrar o RP na hora',
    'Usar uma justificativa criativa dentro da narrativa',
    'Ignorar totalmente e sair',
    'Falar em off no chat local'
  ], 1);

  addS('Imersão', 'Se estiver sem microfone no RP, uma substituição mais imersiva seria:', [
    'Meu headset quebrou',
    'Meu Discord travou',
    'Minha garganta tá ruim',
    'Meu push-to-talk sumiu'
  ], 2);

  addS('Imersão', 'Trocar de roupa na frente de outros players, sem contexto, é:', [
    'Normal',
    'Recomendado',
    'Uma quebra de imersão',
    'Obrigatório nas ruas'
  ], 2);

  addS('Imersão', 'Ao precisar sair da cidade/logar off perto de outros players, o melhor é:', [
    'Deslogar no mesmo lugar sem falar nada',
    'Sair de forma imersiva e em local adequado',
    'Fechar o jogo no meio da conversa',
    'Usar qualquer desculpa fora do RP'
  ], 1);

  addS('Imersão', 'Usar palavras do mundo exterior diretamente no RP deve ser:', [
    'Incentivado',
    'Usado só por líderes',
    'Evitado',
    'Usado em eventos especiais'
  ], 2);

  addS('Imersão', 'A frase "tô com os olhos abertos" é usada para substituir:', [
    'Tô mutado',
    'Tô em live',
    'Tô sem áudio',
    'Tô com lag'
  ], 1);

  addS('Imersão', 'Usar comandos do F8 para flutuar ou sentar no ar sem sentido no RP é:', [
    'Aceitável se for engraçado',
    'Uma conduta a ser evitada',
    'Obrigatório em eventos',
    'Parte do padrão da empresa'
  ], 1);

  // =========================
  // UNIFORME / PRÉDIO / VEÍCULOS
  // =========================
  addS('Uniforme', 'Dentro do prédio da SantaCreators, o uso obrigatório é de:', [
    'Qualquer roupa neutra',
    'Somente boné',
    'Jaqueta da SantaCreators',
    'Roupa civil sem identificação'
  ], 2);

  addS('Uniforme', 'Nas proximidades do prédio, o membro deve usar:', [
    'Ao menos uma peça da SantaCreators',
    'Apenas calça preta',
    'Somente acessório discreto',
    'Qualquer roupa desde que esteja armado'
  ], 0);

  addS('Uniforme', 'Para usar as garagens da empresa, é necessário:', [
    'Somente ter cargo',
    'Estar com ao menos uma peça da SantaCreators',
    'Estar com jaqueta e boné juntos',
    'Pedir autorização por DM'
  ], 1);

  addS('Uniforme', 'Se a pessoa entrar no prédio sem a jaqueta, o correto é:', [
    'Continuar normalmente',
    'Sair da cidade',
    'Ir a uma sala sozinho e vestir a peça',
    'Trocar de cargo'
  ], 2);

  addS('Veículos', 'Usar veículos da SantaCreators para troca de tiro é:', [
    'Permitido com print',
    'Proibido',
    'Permitido em qualquer horário',
    'Recomendado em evento'
  ], 1);

  addS('Veículos', 'Usar veículos do prédio para assalto de pista é:', [
    'Permitido se estiver em dupla',
    'Permitido se for perto',
    'Proibido',
    'Permitido só para liderança'
  ], 2);

  addS('Veículos', 'Sequestro com veículo da empresa só é permitido quando:', [
    'For improvisado e rápido',
    'Houver RP organizado e dentro do horário permitido',
    'Qualquer membro quiser fazer',
    'Acontecer sem planejamento'
  ], 1);

  addS('Uniforme', 'Em ações ilegais fora da sede, o uso do uniforme é:', [
    'Obrigatório para mostrar poder',
    'Livre em qualquer situação',
    'Proibido, devendo trocar de roupa antes',
    'Permitido somente para gestores'
  ], 2);

  addS('Uniforme', 'Trocar de roupa na frente de outros players durante ação externa é:', [
    'O ideal',
    'Errado, devendo ser feito em local privado',
    'Aceitável se for rápido',
    'Exigido pela empresa'
  ], 1);

  // =========================
  // BAÚS
  // =========================
  addS('Baús', 'O baú pessoal da SantaCreators é:', [
    'Uso livre e exclusivo do membro',
    'Compartilhado com toda a equipe',
    'Reservado à coordenação',
    'Somente para vendas'
  ], 0);

  addS('Baús', 'No baú geral, o uso correto é:', [
    'Pegar para vender e lucrar sozinho',
    'Usar com bom senso e pensar nos colegas',
    'Levar tudo que precisar sem repor',
    'Trocar os itens com outras facções'
  ], 1);

  addS('Baús', 'No baú geral, qual destas opções respeita a regra?', [
    'Retirar em excesso para guardar',
    'Pegar somente o necessário para consumo próprio',
    'Distribuir para qualquer um de fora',
    'Usar para comércio livre'
  ], 1);

  addS('Baús', 'O baú creators serve para:', [
    'Consumo livre entre os membros',
    'Guardar dinheiro pessoal',
    'Doações e entregas, sem retirada',
    'Vendas rápidas no RP'
  ], 2);

  addS('Baús', 'Retirar item do baú creators é:', [
    'Permitido para qualquer cargo',
    'Permitido se repor depois',
    'Proibido',
    'Permitido só em evento'
  ], 2);

  addS('Baús', 'No baú de vendas, a divisão correta é:', [
    '100% painel',
    '100% para quem vendeu',
    '70% para você e 30% painel',
    '50% para você e 50% para o painel'
  ], 3);

  addS('Baús', 'Se alguém usar o baú de vendas e não dividir corretamente, a punição prevista é:', [
    'Somente aviso verbal',
    'Ban imediato',
    'Perda de um ponto',
    'Nada acontece'
  ], 1);

  addS('Baús', 'O baú coordenação é voltado para:', [
    'Organização interna de metas e entregas',
    'Armas do baú geral',
    'Itens pessoais de membros',
    'Somente bebidas e kits'
  ], 0);

  addS('Baús', 'O baú responsável pode ser acessado por:', [
    'Todos os creators',
    'Somente a RESP',
    'Apenas Social Médias',
    'Qualquer membro em evento'
  ], 1);

  // =========================
  // PODERES / ANTI-RP
  // =========================
  addS('Poderes', 'Os poderes da SantaCreators existem para:', [
    'Benefício pessoal no RP',
    'Ganhar vantagem em ação',
    'Fins administrativos e empresariais',
    'Facilitar fuga em confronto'
  ], 2);

  addS('Poderes', 'Usar comando para ir até um amigo no outro lado da cidade durante o RP é:', [
    'Organização da empresa',
    'Abuso de poder',
    'Uso normal do cargo',
    'Permitido se for rápido'
  ], 1);

  addS('Poderes', 'A regra de ouro sobre poderes é:', [
    'Líder pode tudo',
    'Se for amigo, pode ajudar',
    'Só usar em evento',
    'Se um player comum não pode, você também não pode'
  ], 3);

  addS('Poderes', 'Usar noclip sem necessidade, fora de demanda da empresa, é:', [
    'Correto',
    'Abuso de poder',
    'Obrigatório para gestão',
    'Permitido em qualquer patrulha'
  ], 1);

  addS('Poderes', 'Se morrer em uma ação de RP, o correto é:', [
    'Usar /god e voltar na hora',
    'Chamar médico ou ir para os bombeiros',
    'Levantar sozinho e continuar',
    'Usar poder para resetar a cena'
  ], 1);

  addS('Poderes', 'Se alguém cometer anti-rp contra você, o primeiro passo correto é:', [
    'Punir na hora usando poderes',
    'Clinar o jogo e voltar',
    'Clipar tudo e pegar os passaportes',
    'Trazer a pessoa por comando'
  ], 2);

  addS('Poderes', 'Em caso de anti-rp sofrido, você nunca deve:', [
    'Enviar para seu responsável',
    'Guardar provas',
    'Usar seus poderes para resolver na hora',
    'Relatar o caso'
  ], 2);

  addS('Poderes', 'Sem alinhamento e sem autorização, o uso de comando da gestão deve ser:', [
    'Liberado para qualquer situação',
    'Evitado',
    'Usado apenas à noite',
    'Feito só com print'
  ], 1);

  addS('Poderes', 'Na dúvida sobre usar um poder, a orientação correta é:', [
    'Usar primeiro e explicar depois',
    'Perguntar antes',
    'Usar escondido',
    'Esperar alguém reclamar'
  ], 1);

  // =========================
  // CALL / ORGANIZAÇÃO / PONTO
  // =========================
  addS('Organização', 'Ficar em call na cidade é obrigatório para todos?', [
    'Sim, sempre',
    'Não',
    'Só para creators',
    'Só em domingo'
  ], 1);

  addS('Organização', 'Para quem busca entrosamento, aprendizado e evolução, a call é:', [
    'Proibida',
    'Irrelevante',
    'Altamente recomendada',
    'Substituída por mensagem'
  ], 2);

  addS('Organização', 'Responsáveis têm obrigação de:', [
    'Ficar invisíveis',
    'Ficar em call para ajudar a equipe',
    'Evitar contato com a base',
    'Resolver tudo apenas por texto'
  ], 1);

  addS('Organização', 'Alinhamentos na SantaCreators acontecem:', [
    'Em call com o responsável',
    'Somente por DM',
    'Exclusivamente por e-mail',
    'No privado com qualquer membro'
  ], 0);

  addS('Organização', 'Sempre que usar poderes, você deve:', [
    'Ignorar se for pouca coisa',
    'Registrar no final do dia no canal correto',
    'Mandar print só no privado',
    'Avisar apenas se der problema'
  ], 1);

  addS('Organização', 'O bate ponto da SantaCreators funciona em quais horários?', [
    '08:00 às 12:00',
    '14:00 às 18:00',
    '17:00 às 23:00 e 01:00 às 04:00',
    'Somente às 19:00'
  ], 2);

  addS('Organização', 'Atualmente, qual destes itens gera pontos no sistema?', [
    'Registro de poderes utilizados',
    'Entrar em call por 5 minutos',
    'Mudar foto no Discord',
    'Mandar emoji no chat'
  ], 0);

  addS('Organização', 'A regra sobre registros importantes é:', [
    'Registrar duas vezes por garantia',
    'Registrar só quando lembra',
    'Registrar somente uma vez por dia, quando necessário',
    'Nunca registrar no mesmo dia'
  ], 2);

  // =========================
  // ADVERTÊNCIAS / PRESENÇA
  // =========================
  addS('Advertência', 'Qual destas situações pode gerar advertência nas proximidades da sede?', [
    'Estar sem identificação da empresa',
    'Entrar em call',
    'Usar a garagem corretamente',
    'Perguntar uma dúvida'
  ], 0);

  addS('Advertência', 'Qual destes exemplos representa quebra de imersão?', [
    'Vou meditar um cado',
    'Preciso mentalizar um portão abrindo do além',
    'Minha mãe tá me chamando',
    'Tive uma tontura forte'
  ], 2);

  addS('Advertência', 'Má conduta envolve:', [
    'Somente atraso em evento',
    'Falta de respeito e respostas debochadas',
    'Usar roupa da empresa',
    'Perguntar em alinhamento'
  ], 1);

  addS('Advertência', 'Para cargos Coord.+, Resp. Líder e Resp. Influ, os eventos das 19:00 são:', [
    'Opcionais',
    'Só recomendados',
    'Obrigatórios',
    'Facultativos em dias úteis'
  ], 2);

  addS('Advertência', 'Caso não possa comparecer ao evento das 19:00, é obrigatório:', [
    'Avisar depois do evento',
    'Registrar ausência até 18:30 com justificativa',
    'Faltar e explicar no dia seguinte',
    'Mandar DM para qualquer membro'
  ], 1);

  addS('Advertência', 'Falta sem presença e sem justificativa dentro do prazo gera:', [
    'Somente um lembrete',
    'ADV 1/3 e -5 pontos',
    'Promoção suspensa por 1 hora',
    'Nada, se for liderança'
  ], 1);

  addS('Advertência', 'Ao atingir 3/3 de ADV, acontece:', [
    'Reset automático',
    'Mudança de cidade',
    'Reavaliação da permanência e da posição',
    'Bônus de advertência'
  ], 2);

  // =========================
  // HIERARQUIA / GI
  // =========================
  addS('Hierarquia', 'A gestaoinfluencer é:', [
    'Um grupo separado da SantaCreators',
    'O núcleo interno da própria SantaCreators',
    'Uma facção paralela',
    'Um cargo temporário fora da empresa'
  ], 1);

  addS('Hierarquia', 'O acesso à gestaoinfluencer acontece por:', [
    'Pedido no privado',
    'Formulário aberto',
    'Convite baseado em evolução e confiança',
    'Compra de vaga'
  ], 2);

  addS('Hierarquia', 'O nível 3 da estrutura oficial da SantaCreators é:', [
    'Responsáveis',
    'Coordenação',
    'Creator',
    'Gestão interna'
  ], 2);

  addS('Hierarquia', 'No nível 2 ficam funções como:', [
    'Resp. Líder e Resp. Influ',
    'Social Médias, Manager e Gestor',
    'Somente Creator',
    'Apenas membros externos'
  ], 1);

  addS('Hierarquia', 'O nível 1 da SantaCreators é formado por:', [
    'Social Médias e Gestor',
    'Creator e EQP.M',
    'Os cargos responsáveis da liderança',
    'Somente convidados externos'
  ], 2);

  addS('Hierarquia', 'O caminho normal até a gestaoinfluencer é:', [
    'Entrar e pedir convite imediato',
    'Participar, evoluir e ser convidado',
    'Fazer teste e comprar cargo',
    'Esperar sorteio interno'
  ], 1);

  // =========================
  // SOCIAL MÉDIAS
  // =========================
  addS('Social Médias', 'A principal função da Social Médias é:', [
    'Cuidar só do ZipZap',
    'Organizar e estruturar os eventos da SantaCreators',
    'Apenas aprovar líderes',
    'Somente criar cargos no Discord'
  ], 1);

  addS('Social Médias', 'Os eventos da SantaCreators acontecem em quais dias?', [
    'Somente sexta e sábado',
    'Segunda a sábado',
    'Terça a domingo',
    'Todos os dias com domingo incluso'
  ], 1);

  addS('Social Médias', 'O horário padrão dos eventos é:', [
    '18:00',
    '19:00',
    '20:00',
    '21:00'
  ], 1);

  addS('Social Médias', 'O cronograma da semana deve ser organizado em qual dia?', [
    'Segunda',
    'Quarta',
    'Domingo',
    'Sábado após 22:00'
  ], 2);

  addS('Social Médias', 'Na montagem do cronograma, não pode repetir:', [
    'O mesmo evento na mesma cidade e mesmo dia da semana anterior',
    'Nenhum evento da semana passada',
    'Nenhuma cidade usada antes',
    'A mesma roupa da semana passada'
  ], 0);

  addS('Social Médias', 'A divulgação do evento deve ser feita no dia do evento entre:', [
    '00:00 e 17:00',
    '12:00 e 19:00',
    '17:00 e 23:00',
    'Somente às 18:59'
  ], 0);

  addS('Social Médias', 'Após o evento, a equipe deve registrar presença no canal de:', [
    'Poderes em evento',
    'Baú geral',
    'Convite de líderes',
    'Cadastro de uniforme'
  ], 0);

  addS('Social Médias', 'Na premiação, VIPs comerciais como Ouro e Platinum exigem autorização de:', [
    'Qualquer manager',
    'Macedo ou diretoria da cidade',
    'Somente EQP.M',
    'Qualquer creator antigo'
  ], 1);

  // =========================
  // MANAGER
  // =========================
  addS('Manager', 'A missão da equipe Manager Creators é:', [
    'Organizar baús e garagens',
    'Garantir organizações presentes nos eventos',
    'Criar roupas da empresa',
    'Cuidar apenas da call'
  ], 1);

  addS('Manager', 'Os eventos com maior contingente para atuação dos Managers são:', [
    'Segunda, terça e quarta',
    'Quinta, sexta e sábado',
    'Somente domingo',
    'Somente quarta e sábado'
  ], 1);

  addS('Manager', 'O prazo para registrar organizações vai de:', [
    'Segunda até sábado 19:00',
    'Domingo 00:00 até quinta 16:00',
    'Terça até sexta 12:00',
    'Quinta até domingo 00:00'
  ], 1);

  addS('Manager', 'Para convidar uma organização, o contato deve ser feito com:', [
    'Qualquer membro da facção',
    'Somente membros novatos',
    'Diretamente com um líder da organização',
    'Apenas via mensagem automática'
  ], 2);

  addS('Manager', 'Registrar organização sem falar com o líder é:', [
    'Aceitável se a base confirmar',
    'Errado',
    'Permitido com print de terceiros',
    'Obrigatório em caso de pressa'
  ], 1);

  addS('Manager', 'Como Manager, você é staff?', [
    'Sim, sempre',
    'Não',
    'Só em evento',
    'Só em call'
  ], 1);

  addS('Manager', 'No RP, convidar organização dentro do NC é:', [
    'Permitido se for rápido',
    'Proibido',
    'Obrigatório para segurança',
    'Aceitável só com líder online'
  ], 1);

  addS('Manager', 'Cada organização registrada gera para o Manager:', [
    'Advertência',
    'Mudança de cargo',
    'Pontos no sistema',
    'Bloqueio de painel'
  ], 2);

  // =========================
  // GESTOR
  // =========================
  addS('Gestor', 'A principal missão do Gestor Creators é:', [
    'Punir membros da base',
    'Formar e orientar quem está começando',
    'Cuidar do financeiro dos eventos',
    'Apenas acompanhar dashboards'
  ], 1);

  addS('Gestor', 'Para ser Gestor Creators, a pessoa deve ter vindo de:', [
    'Qualquer área sem experiência',
    'Somente Creator',
    'Social Médias ou Manager Creators',
    'Somente Resp Líder'
  ], 2);

  addS('Gestor', 'O Gestor ensina principalmente quem está em fase:', [
    'Final da liderança',
    'Inicial da equipe',
    'Somente responsável',
    'Externa à empresa'
  ], 1);

  addS('Gestor', 'Os feedbacks do Gestor devem ser:', [
    'Genéricos e curtos',
    'Só elogios',
    'Detalhados, com qualidades, erros e evolução',
    'Feitos só por emoji'
  ], 2);

  addS('Gestor', 'Sempre que ensinar algo a alguém da equipe, o Gestor deve:', [
    'Guardar só para si',
    'Registrar o ensinamento',
    'Esperar o membro registrar',
    'Avisar apenas em call'
  ], 1);

  addS('Gestor', 'Ao registrar alinhamento, deve ser informado:', [
    'O nome do evento da semana',
    'O ID Discord da pessoa alinhada',
    'A cor do cargo atual',
    'O número do painel'
  ], 1);

  addS('Gestor', 'Ser Gestor substitui a função anterior da pessoa?', [
    'Sim, ela abandona a área antiga',
    'Não, ela continua na função de origem também',
    'Sim, mas só por um mês',
    'Somente se vier da Social'
  ], 1);

  // =========================
  // COORD
  // =========================
  addS('Coordenação', 'O Coord Creators é visto como:', [
    'Somente alguém do financeiro',
    'Braço direito da liderança e quem faz tudo funcionar',
    'Membro restrito à call',
    'Apenas moderador de chat'
  ], 1);

  addS('Coordenação', 'O Coord precisa dominar quais áreas?', [
    'Somente Social Médias',
    'Somente Manager',
    'Social, Manager e Gestor',
    'Apenas Resp Influ'
  ], 2);

  addS('Coordenação', 'Se faltar alguém em uma área da equipe, o Coord deve:', [
    'Ignorar até alguém aparecer',
    'Assumir temporariamente para nada quebrar',
    'Cancelar o evento da semana',
    'Mandar DM e sair'
  ], 1);

  addS('Coordenação', 'Além de executar funções, o Coord também deve:', [
    'Coordenar e acompanhar as equipes',
    'Evitar contato com a base',
    'Fazer somente registros',
    'Trabalhar só em domingo'
  ], 0);

  addS('Coordenação', 'O próximo passo natural de evolução do Coord Creators é:', [
    'Creator',
    'Resp Líder',
    'EQP.M',
    'Junior de cidade'
  ], 1);

  // =========================
  // RESPONSÁVEIS
  // =========================
  addS('Responsáveis', 'O Resp Líder deve acompanhar principalmente se:', [
    'A equipe está organizada e a coordenação está funcionando',
    'Os baús estão cheios',
    'Todo mundo está em live',
    'Os membros usam só jaqueta longa'
  ], 0);

  addS('Responsáveis', 'Se houver membro iniciante presente, o Resp Líder deve:', [
    'Fazer tudo sozinho',
    'Ignorar a pessoa',
    'Ensinar e orientar na hora',
    'Mandar a pessoa sair'
  ], 2);

  addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
    'Somente elogios',
    'Banimento do painel e do Discord com regra e evidência',
    'Premiações VIP comerciais sem critério',
    'Qualquer ação sem prova'
  ], 1);

  addS('Responsáveis', 'O Resp Creators é:', [
    'Responsável máximo pela operação da equipe Creators',
    'Somente líder de evento',
    'A base da GI 5',
    'Cargo temporário de teste'
  ], 0);

  addS('Responsáveis', 'Entre as responsabilidades do Resp Creators está:', [
    'Apenas entrar em call',
    'Aprovar premiações de eventos e supervisionar decisões importantes',
    'Convidar toda organização sozinho',
    'Só cuidar do baú pessoal'
  ], 1);

  addS('Responsáveis', 'Na hierarquia final da equipe, a ordem correta de subida é:', [
    'Coord > Gestor > Manager > Social',
    'Social/Manager > Gestor > Coord > Resp Líder > Resp Influ > Resp Creators',
    'Creator > Resp Creators > Coord > Gestor',
    'EQP.M > Creator > Coord > Social'
  ], 1);

  return Q;
})();

globalThis.SC_QUIZ_BANK = globalThis.SC_QUIZ_BANK ?? SC_QUIZ_BANK;

    // ======= HELPERS =======
    function scq_nowBRT() {
      // Ajuste simples: usa horário do host. Se seu host estiver UTC, adapte conforme necessidade.
      return new Date();
    }
    function scq_dayKey(d = scq_nowBRT()) {
      return d.toISOString().slice(0,10);
    }
    function scq_randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
    function scq_shuffle(arr) {
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function scq_normalizeAnswer(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  // só aceita letra se a mensagem for APENAS a letra
  if (/^[A-D]$/i.test(s)) return s[0].toUpperCase();
  return s.toUpperCase();
}

// ✅ NOVA — usada para bloquear novos posts enquanto há um quiz válido em aberto
function scq_hasActiveQuiz() {
  return !!SC_QUIZ_STATE.currentValidMessageId && SC_QUIZ_STATE.currentSatisfied === false;
}




function scq_isSingleLetter(raw) {
  return /^[A-D]$/i.test(String(raw).trim());
}

function scq_pickAnswerLetter(raw, q /* opcional */) {
  const s = String(raw).trim().toUpperCase();
  if (/^[A-D]$/.test(s)) return s; // usuário mandou a letra

  // se veio texto, tente casar com alguma opção do enunciado
  if (q && Array.isArray(q.opcoes)) {
    for (const opt of q.opcoes) {
      const letter = opt[0];                    // 'A'
      const text   = opt.slice(3).trim().toUpperCase(); // depois de "A) "
      if (s === text) return letter;
    }
  }
  return null;
}

    
    function scq_getRandomQuestion(excludeIds = new Set()) {
      const pool = SC_QUIZ_BANK.filter(q => !excludeIds.has(q.id));
      if (pool.length === 0) return null;
      return pool[Math.floor(Math.random()*pool.length)];
    }

    function scq_buildEmbed({title, description, fields, footer, image, color=0x915BFF}) {
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
        SC_QUIZ_STATE.leaderboard[userId] = { acertos:0, erros:0, interacoes:0, lastAt: Date.now() };
      }
      const r = SC_QUIZ_STATE.leaderboard[userId];
      r.acertos += right;
      r.erros   += wrong;
      r.interacoes += (right + wrong);
      r.lastAt = Date.now();
      scq_save();
    }

// Cancela QUALQUER quiz ativo (diário e/ou relâmpago) e invalida o “atual”
function scq_cancelAllActive(reason = 'override') {
  try {
    // invalida relâmpago
    if (SC_QUIZ_STATE.rt?.active) {
      const old = SC_QUIZ_STATE.rt.active;
      if (old?.messageId && SC_QUIZ_STATE.rt.attempts) {
        delete SC_QUIZ_STATE.rt.attempts[old.messageId];
      }
      SC_QUIZ_STATE.rt.active = null;
    }

    // diário: não precisa apagar mensagens do canal; só invalida o “válido”
    SC_QUIZ_STATE.currentValidMessageId = null;

    // marca como “satisfeito” para liberar novo post logo depois
    SC_QUIZ_STATE.currentSatisfied = true;

    scq_save();
    console.log('[SC_QUIZ] cancelado anterior:', reason);
  } catch (e) {
    console.error('[SC_QUIZ] erro ao cancelar ativos:', e);
  }
}


    
// ——— alinhamento em bloco monoespaçado (tabela)
function scq_padEndMono(str, len) {
  const s = String(str ?? '');
  return s.length >= len ? s.slice(0, len - 1) + '…' : s + ' '.repeat(len - s.length);
}
function scq_buildMonoTable(rows) {
  // rows: [{pos, name, a, e, i, pct}]
  const NAME_W = 22; // ↑ ajuste se quiser mais/menos espaço p/ nomes

  const wA = Math.max(2, ...rows.map(r => String(r.a).length));
  const wE = Math.max(2, ...rows.map(r => String(r.e).length));
  const wI = Math.max(2, ...rows.map(r => String(r.i).length));
  const wP = 3;

  const header =
    `#  ${scq_padEndMono('Nome', NAME_W)}  ` +
    `A`.padStart(wA) + '  ' +
    `E`.padStart(wE) + '  ' +
    `I`.padStart(wI) + '  ' +
    `%`.padStart(wP);

  const lines = rows.map(r =>
    String(r.pos).padStart(2) + '  ' +
    scq_padEndMono(r.name, NAME_W) + '  ' +
    String(r.a).padStart(wA) + '  ' +
    String(r.e).padStart(wE) + '  ' +
    String(r.i).padStart(wI) + '  ' +
    String(r.pct).padStart(wP)
  );

  return '```txt\n' + header + '\n' + lines.join('\n') + '\n```';
}

   // === PRO — Gera o gráfico via POST e devolve como ANEXO (buffer) ===
async function scq_buildChartAttachment({ labels, data, title, color = 'rgb(145, 91, 255)' }) {
  const fill = color.replace('rgb', 'rgba').replace(')', ',0.7)');

  // dá “respiro” à direita: aumenta o eixo X
  const maxVal = Math.max(1, ...data);
  const suggestedMax = Math.ceil(maxVal * 1.25); // pode ajustar 1.20–1.35

  const cfg = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: fill,
        borderColor: color,
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 22,
        barPercentage: 0.9,
        categoryPercentage: 0.9
      }]
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      // mais espaço visual à direita
      layout: { padding: { left: 12, right: 56, top: 10, bottom: 10 } },
      plugins: {
        legend: { display: false },
        title: { display: true, text: title, color: '#E6EDF3', font: { size: 18, weight: '600' } },
        // rótulo DENTRO da barra, do lado direito
        datalabels: { anchor: 'end', align: 'left', offset: 6, clamp: true, color: '#E6EDF3', font: { size: 12, weight: '600' } },
        tooltip: { enabled: false }
      },
      scales: {
        x: {
          suggestedMax,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#C9D1D9', precision: 0 },
          border: { display: false }
        },
        y: { grid: { display: false }, ticks: { color: '#C9D1D9' }, border: { display: false } }
      }
    }
  };

  const res = await fetch('https://quickchart.io/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chart: cfg,
      width: 1000,
      height: 560,
      devicePixelRatio: 2,
      backgroundColor: 'transparent',
      format: 'png',
      plugins: ['datalabels']
    })
  });

  const buf = Buffer.from(await res.arrayBuffer());
  const name = `chart_${Math.random().toString(36).slice(2)}.png`;
  return { attachment: buf, name };
}



async function scq_renderRankingSticky() {
  try {
    const channel = await client.channels.fetch(SC_QUIZ_RANKING_CHANNEL_ID).catch(() => null);
    if (!channel) return;

    const entries = Object.entries(SC_QUIZ_STATE.leaderboard);
    const byAcertos = entries.slice().sort((a,b) =>
      (b[1].acertos - a[1].acertos) || (a[1].erros - b[1].erros)
    );
    const byInter = entries.slice().sort((a,b) =>
      (b[1].interacoes - a[1].interacoes) || (b[1].acertos - a[1].acertos)
    );

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

    // === GRÁFICO + LINHAS (colorido) ===================================
async function labelsFrom(list){
  const arr = [];
  for (const [uid] of list) {
    const name = await scq_userDisplayNameSafe(guild, uid, `User ${uid}`);
    arr.push(name.length > 18 ? name.slice(0, 17) + '…' : name); // corta nome longo
  }
  return arr;
}

const labelsA = await labelsFrom(topAList);
const labelsI = await labelsFrom(topIList);
const dataA   = topAList.map(([_,d]) => d.acertos);
const dataI   = topIList.map(([_,d]) => d.interacoes);

// gera ARQUIVOS (anexos) para não estourar o limite de URL
const chartAFile = await scq_buildChartAttachment({
  labels: labelsA, data: dataA, title: 'Top Acertos',    color: 'rgb(46, 204, 113)'
});
const chartIFile = await scq_buildChartAttachment({
  labels: labelsI, data: dataI, title: 'Top Interações', color: 'rgb(243, 156, 18)'
});

const embedA = scq_buildEmbed({
  title: '🏆 Ranking — Top Acertos',
  description: topA.length ? topA.join('\n') : '_Sem dados ainda_',
  footer: 'Atualiza automaticamente após cada rodada.',
  color: 0x2ECC71
});
embedA.image = { url: `attachment://${chartAFile.name}` };
embedA.timestamp = new Date().toISOString();

const embedI = scq_buildEmbed({
  title: '🔥 Ranking — Top Interações',
  description: topI.length ? topI.join('\n') : '_Sem dados ainda_',
  footer: 'Atualiza automaticamente após cada rodada.',
  color: 0xF39C12
});
embedI.image = { url: `attachment://${chartIFile.name}` };
embedI.timestamp = new Date().toISOString();




    // …o restante do seu código (editar/enviar as 2 mensagens) fica igual

    // — Mensagem 1: Acertos (com arquivo)
if (SC_QUIZ_STATE.stickyRankingMsgIdAcertos) {
  try {
    const msg = await channel.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdAcertos);
    await msg.edit({ embeds: [embedA], files: [chartAFile] });
  } catch {
    const sent = await channel.send({ embeds: [embedA], files: [chartAFile] });
    SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id;
  }
} else {
  const sent = await channel.send({ embeds: [embedA], files: [chartAFile] });
  SC_QUIZ_STATE.stickyRankingMsgIdAcertos = sent.id;
}


 


    // — Mensagem 2: Interações (com arquivo)
if (SC_QUIZ_STATE.stickyRankingMsgIdInteracoes) {
  try {
    const msg = await channel.messages.fetch(SC_QUIZ_STATE.stickyRankingMsgIdInteracoes);
    await msg.edit({ embeds: [embedI], files: [chartIFile] });
  } catch {
    const sent = await channel.send({ embeds: [embedI], files: [chartIFile] });
    SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id;
  }
} else {
  const sent = await channel.send({ embeds: [embedI], files: [chartIFile] });
  SC_QUIZ_STATE.stickyRankingMsgIdInteracoes = sent.id;
}


   


    scq_save();
  } catch (e) {
    console.error('[SC_QUIZ] Erro ao render ranking:', e);
  }
}


    async function scq_log(embed) {
      try {
        const ch = await client.channels.fetch(SC_QUIZ_LOGS_CHANNEL_ID).catch(() => null);
        if (!ch) return;
        await ch.send({ embeds: [embed] });
      } catch (_) {}
    }

    async function scq_clearPreviousQuizMessages(channel) {
      try {
        if (!channel) return;

        // apaga a pergunta anterior
        if (SC_QUIZ_STATE.currentQuizChannelMessageId) {
          const oldQuizMsg = await channel.messages.fetch(SC_QUIZ_STATE.currentQuizChannelMessageId).catch(() => null);
          if (oldQuizMsg) {
            await oldQuizMsg.delete().catch(() => {});
          }
          SC_QUIZ_STATE.currentQuizChannelMessageId = null;
        }

        // apaga o último feedback público (parabéns / incorreta / encerrado)
        if (SC_QUIZ_STATE.lastPublicFeedbackMessageId) {
          const oldFeedbackMsg = await channel.messages.fetch(SC_QUIZ_STATE.lastPublicFeedbackMessageId).catch(() => null);
          if (oldFeedbackMsg) {
            await oldFeedbackMsg.delete().catch(() => {});
          }
          SC_QUIZ_STATE.lastPublicFeedbackMessageId = null;
        }

        scq_save();
      } catch (e) {
        console.error('[SC_QUIZ] erro ao limpar mensagens anteriores do canal:', e);
      }
    }

       // ✅ Função global: posta o QUIZ DIÁRIO no canal Creators
 async function scq_postDailyQuiz(override = false) {
  if (!override && scq_hasActiveQuiz()) {
    console.log("[SC_QUIZ] Já tem um quiz ativo, não vou postar outro.");
    return;
  }
  if (override) scq_cancelAllActive('daily_override');

  const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
  if (!channel) return;

  // limpa a pergunta anterior e o último feedback público antes de postar a próxima
  await scq_clearPreviousQuizMessages(channel);

  const q = scq_getRandomQuestion();
  if (!q) return;

  const embed = scq_buildEmbed({
    title: '🎯 QUIZ DIÁRIO — Vale Pontos Internos!',
    description: [
      `> Responda **por REPLY** a esta mensagem para participar.`,
      `> Quem responder é chamado no PV com **${SC_QUIZ_EXTRA_DM_QUESTIONS}** perguntas extras (sem cola 😉).`,
      '',
      `**${q.texto}**`,
      '',
      q.opcoes.map(x => `• ${x}`).join('\n'),
      '',
      '_Responda com a letra (A/B/C/D) ou o texto. Boa sorte!_'
    ].join('\n'),
    image: GIF_QUIIZ_URL,
    footer: 'Responda por reply nesta mensagem.'
  });

  const msg = await channel.send({
    content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`,
    embeds: [embed],
    allowedMentions: { roles: SC_MENTION_ROLES }
  });

  // guarda a mensagem atual postada no canal
  SC_QUIZ_STATE.currentQuizChannelMessageId = msg.id;

  // marca como “válido” e bloqueia novos até interação
  SC_QUIZ_STATE.currentValidMessageId = msg.id;
  SC_QUIZ_STATE.currentSatisfied = false;

  // controles antigos do diário (mantém histórico p/ DM etc.)
  SC_QUIZ_STATE.participantsByMsg[msg.id] = {};
  SC_QUIZ_STATE.activeQuizMessages.push({ id: msg.id, qid: q.id, createdAt: Date.now() });
  if (SC_QUIZ_STATE.activeQuizMessages.length > 20) {
    const removed = SC_QUIZ_STATE.activeQuizMessages.splice(
      0, SC_QUIZ_STATE.activeQuizMessages.length - 20
    );
    for (const r of removed) delete SC_QUIZ_STATE.participantsByMsg[r.id];
  }
  scq_save();

  await scq_log(scq_buildEmbed({
    title: '📝 Quiz postado',
    description: `Canal: <#${SC_QUIZ_CREATORS_CHANNEL_ID}>\nMsgID: \`${msg.id}\`\nPergunta: **${q.texto}**\nOpções:\n${q.opcoes.join('\n')}`,
    footer: `qid=${q.id}`
  }));

  await scq_renderRankingSticky();
}



 // =================== FAST QUIZ — FUNÇÕES ===================
function sc_rt_getRandomQuestion() {
  if (!SC_RT_BANK.length) return null;
  return SC_RT_BANK[Math.floor(Math.random()*SC_RT_BANK.length)];
}

// 🔧 Helper único para iniciar uma rodada de relâmpago (fora de qualquer função)
async function sc_rt_beginRound(channel, embed, q, { announceOnTimeout = false } = {}) {
  // limpa a pergunta anterior e o último feedback público antes de postar a próxima
  await scq_clearPreviousQuizMessages(channel);

  const msg = await channel.send({
    content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`,
    embeds: [embed],
    allowedMentions: { roles: SC_MENTION_ROLES }
  });

  // garante a estrutura no estado
  SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
  SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};

  // guarda a mensagem atual postada no canal
  SC_QUIZ_STATE.currentQuizChannelMessageId = msg.id;

  // ✅ objeto correto
  SC_QUIZ_STATE.rt.active = {
    messageId: msg.id,
    qid: q.id,
    correct: q.resposta,
    createdAt: Date.now(),
    winnerId: null
  };
  SC_QUIZ_STATE.rt.attempts[msg.id] = {};

  // marca este como o único “válido”
  SC_QUIZ_STATE.currentValidMessageId = msg.id;
  SC_QUIZ_STATE.currentSatisfied = false;

  scq_save();

  setTimeout(async () => {
  try {
    const act = SC_QUIZ_STATE.rt.active;
    if (!act || act.messageId !== msg.id || act.winnerId) return;

    // NÃO mata a rodada: mantém o alvo vivo pra ainda aceitarmos 1 resposta
    // (assim, “só manda outro” quando alguém responder o anterior)
    SC_QUIZ_STATE.rt.active.timedOut = true;

    // não mexe em currentValidMessageId nem em currentSatisfied
    scq_save();

    if (announceOnTimeout) {
      const timeoutMsg = await channel.send({
        embeds: [scq_buildEmbed({
          title: '⏰ Relâmpago encerrado',
          description: `Ninguém acertou a tempo. Gabarito: **${q.resposta}**`,
          image: GIF_QUIIZ_URL
        })]
      });

      SC_QUIZ_STATE.lastPublicFeedbackMessageId = timeoutMsg.id;
      scq_save();
    }

    await scq_log(scq_buildEmbed({
      title: '⏰ Relâmpago encerrado',
      description: `Sem vencedor | qid=${q.id} | gabarito **${q.resposta}**`
    }));
  } catch {}
}, SC_RT_ACTIVE_TIMEOUT_MS);
;
}


async function sc_rt_postFastQuiz(override = false) {
  const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(()=>null);
  if (!channel) return;

  if (!override && scq_hasActiveQuiz()) {
    console.log("[SC_RT] Já tem um quiz ativo, não vou postar outro.");
    return;
  }
  if (override) scq_cancelAllActive('fast_override');

  // encerra e IGNORA QUALQUER rodada antiga (limpa tentativas)
  if (SC_QUIZ_STATE.rt?.active) {
    const old = SC_QUIZ_STATE.rt.active;
    if (old?.messageId && SC_QUIZ_STATE.rt.attempts) {
      delete SC_QUIZ_STATE.rt.attempts[old.messageId];
    }
    SC_QUIZ_STATE.rt.active = null;
    scq_save();
  }

  const q = sc_rt_getRandomQuestion();
  if (!q) return;

  const embed = scq_buildEmbed({
    title: '⚡ PERGUNTA RELÂMPAGO — Vale ponto para o PRIMEIRO!',
    description: [
      `Responda **A/B/C/D** diretamente **aqui no chat** (não precisa reply).`,
      `A **primeira resposta correta** ganha **+${SC_QUIZ_POINTS_RIGHT}**.`,
      '',
      `**${q.texto}**`,
      '',
      q.opcoes.map(x => `• ${x}`).join('\n'),
      '',
      '_Responda A/B/C/D. A mensagem será apagada._'
    ].join('\n'),
    image: GIF_QUIIZ_URL,
    footer: 'Modo relâmpago'
  });

  await sc_rt_beginRound(channel, embed, q, { announceOnTimeout: false });
}

// ✅ NOVA — usada pelo comando !fastid <id>
async function sc_rt_postFastQuizById(qid, override = true) {
  const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
  if (!channel) return;

  if (!qid || isNaN(Number(qid))) return;
  const q = SC_RT_BANK.find(x => x.id === Number(qid));
  if (!q) {
    console.warn(`[SC_RT] fastid inválido: ${qid}`);
    return;
  }

  if (override) scq_cancelAllActive('fastid_override');

  const embed = scq_buildEmbed({
    title: '⚡ QUIZ RELÂMPAGO — Vale Ponto!',
    description: [
      `> **Primeiro** a acertar ganha o ponto.`,
      `> Responda com **A/B/C/D** (a mensagem será apagada pra evitar cola).`,
      '',
      `**${q.texto}**`,
      '',
      q.opcoes.map(x => `• ${x}`).join('\n')
    ].join('\n'),
    image: GIF_QUIIZ_URL,
    footer: `qid=${q.id}`
  });

  await sc_rt_beginRound(channel, embed, q, { announceOnTimeout: true });
}

function sc_rt_pickTodayTimes() {
  const dayKey = scq_dayKey();
  if (SC_QUIZ_STATE.rt.lastScheduleDayKeyFast === dayKey) return;

  const times = [];
  for (let i = 0; i < SC_RT_DAILY_COUNT; i++) {
    const hour = scq_randInt(SC_RT_WINDOW_START_HOUR, SC_RT_WINDOW_END_HOUR);
    const minute = scq_randInt(0, 59);
    const at = new Date();
    at.setHours(hour, minute, scq_randInt(0,59), 0);
    if (at < new Date()) at.setTime(Date.now() + scq_randInt(2,10)*60000);
    times.push(at);
  }
  times.sort((a,b)=>a-b);
  SC_QUIZ_STATE.rt.__todayScheduleFast = times.map(t => t.getTime());
  SC_QUIZ_STATE.rt.lastScheduleDayKeyFast = dayKey;
  scq_save();
  console.log("[SC_RT] horários de hoje:", times.map(t=>t.toTimeString().slice(0,5)).join(', '));
}

let SC_RT_TICK_INTERVAL = null;
function sc_rt_startTickerFast() {
  if (SC_RT_TICK_INTERVAL) clearInterval(SC_RT_TICK_INTERVAL);

  // estado auxiliar persistente (ok se não existir no JSON)
  SC_QUIZ_STATE.rt.nextFastAt = SC_QUIZ_STATE.rt.nextFastAt || 0;

  SC_RT_TICK_INTERVAL = setInterval(async () => {
    try {
      const now = Date.now();
      const today = new Date();
      const start = new Date(
        today.getFullYear(), today.getMonth(), today.getDate(),
        SC_RT_WINDOW_START_HOUR, 0, 0, 0
      ).getTime();
      const end = new Date(
        today.getFullYear(), today.getMonth(), today.getDate(),
        SC_RT_WINDOW_END_HOUR, 0, 0, 0
      ).getTime();

      // vira dia → zera agenda
      const dayKey = scq_dayKey();
      if (SC_QUIZ_STATE.rt.lastScheduleDayKeyFast !== dayKey) {
        SC_QUIZ_STATE.rt.lastScheduleDayKeyFast = dayKey;
        SC_QUIZ_STATE.rt.__todayScheduleFast = [];
        SC_QUIZ_STATE.rt.nextFastAt = 0;
        scq_save();
      }

      if (SC_RT_EVERY_MINUTES > 0) {
        // modo cadência fixa
        if (now < start || now > end) return; // fora da janela
        if (!SC_QUIZ_STATE.rt.nextFastAt || SC_QUIZ_STATE.rt.nextFastAt <= now) {
          await sc_rt_postFastQuiz(false); // respeita bloqueio
          SC_QUIZ_STATE.rt.nextFastAt = now + (SC_RT_EVERY_MINUTES * 60 * 1000);
          scq_save();
        }
        return;
      }

      // modo “X por dia” com horários aleatórios
      if (!SC_QUIZ_STATE.rt.__todayScheduleFast?.length) sc_rt_pickTodayTimes();
      const idx = SC_QUIZ_STATE.rt.__todayScheduleFast.findIndex(t => t && now >= t);
      if (idx >= 0) {
        SC_QUIZ_STATE.rt.__todayScheduleFast.splice(idx, 1);
        scq_save();
        await sc_rt_postFastQuiz(false); // respeita bloqueio

      }
    } catch (e) {
      console.error("[SC_RT] tick error:", e);
    }
  }, 5 * 1000);
}



async function sc_rt_handlePotentialAnswer(message) {
  if (message.channelId !== SC_QUIZ_CREATORS_CHANNEL_ID) return;

  const act = SC_QUIZ_STATE.rt?.active;
  if (!act || message.id === act.messageId) return;

  // reply só vale se apontar pro RELÂMPAGO ATUAL
  if (message.reference?.messageId && message.reference.messageId !== act.messageId) return;

  const q = SC_RT_BANK.find(x => x.id === act.qid);
const ans = scq_pickAnswerLetter(message.content, q);
if (!ans) return;

// Apaga pra evitar cola
message.delete().catch(()=>{});

// ✅ liberar próximos: houve interação “certa” com o quiz válido
if (SC_QUIZ_STATE.currentValidMessageId === act.messageId) {
  SC_QUIZ_STATE.currentSatisfied = true;
}


  // 1 tentativa por usuário por relâmpago
  const msgId = act.messageId;
  SC_QUIZ_STATE.rt.attempts[msgId] = SC_QUIZ_STATE.rt.attempts[msgId] || {};
  if (SC_QUIZ_STATE.rt.attempts[msgId][message.author.id]) return;
  SC_QUIZ_STATE.rt.attempts[msgId][message.author.id] = true;

  const acertou = (ans === act.correct);

  if (!acertou) {
    scq_updateLeaderboard(message.author.id, 0, 1);
    const feedbackMsg = await message.channel.send({
      content: `<@${message.author.id}>`,
      embeds: [scq_buildEmbed({
        title: '❌ Resposta incorreta',
        description: 'Não foi dessa vez! Continue tentando nos próximos relâmpagos. 💪',
        image: GIF_QUIIZ_URL,
        color: 0xE74C3C
      })],
      allowedMentions: { users: [message.author.id] }
    });

    SC_QUIZ_STATE.lastPublicFeedbackMessageId = feedbackMsg.id;
    scq_save();
    try {
      const dm = await message.author.createDM();
      await dm.send({
        content: `<@${message.author.id}>`,
        embeds: [scq_buildEmbed({
          title: '❌ Você errou desta vez',
          description: 'Relaxa! Tenta de novo no próximo ⚡ relâmpago. Persistência dá bom! 🚀',
          image: GIF_QUIIZ_URL
        })]
      });
    } catch {}
    await scq_log(scq_buildEmbed({
      title: '❌ Erro no relâmpago',
      description: `Usuário: <@${message.author.id}> — Resposta: \`${message.content}\``
    }));
    await scq_renderRankingSticky();
    return;
  }

  // vencedor
  act.winnerId = message.author.id;
  SC_QUIZ_STATE.rt.active = null;
  delete SC_QUIZ_STATE.rt.attempts[msgId];
  scq_updateLeaderboard(message.author.id, 1, 0);
  scq_save();

  const feedbackMsg = await message.channel.send({
    content: `<@${message.author.id}>`,
    embeds: [scq_buildEmbed({
      title: '🏁 Parabéns! Resposta correta',
      description: `Você marcou **+${SC_QUIZ_POINTS_RIGHT}** no ranking! Gabarito: **${act.correct}**`,
      image: GIF_QUIIZ_URL,
      color: 0x2ECC71
    })],
    allowedMentions: { users: [message.author.id] }
  });

  SC_QUIZ_STATE.lastPublicFeedbackMessageId = feedbackMsg.id;
  scq_save();

  try {
    const dm = await message.author.createDM();
    await dm.send({
      content: `<@${message.author.id}>`,
      embeds: [scq_buildEmbed({
        title: '🎉 Você acertou primeiro!',
        description: 'Mandou bem demais! +1 ponto no ranking. Continua assim, tá voando! 💜',
        image: GIF_QUIIZ_URL
      })]
    });
  } catch {}

  await scq_log(scq_buildEmbed({
    title: '🏁 Vencedor — Relâmpago',
    description: `Usuário: <@${message.author.id}> — qid=${q.id} — gabarito **${act.correct}**`
  }));

  await scq_renderRankingSticky();
}


   // -------- Avaliar a resposta do chat (reply) e puxar DM -----------
// -------- Avaliar a resposta do chat (reply OU não) e puxar DM -----------
async function scq_handleDailyAnswer(message) {
  try {
    if (message.channelId !== SC_QUIZ_CREATORS_CHANNEL_ID) return;

    // 1) identificar alvo (reply ou última diária)
    let refId = message.reference?.messageId || null;
    if (!refId) {
      const lastDaily = SC_QUIZ_STATE.activeQuizMessages[SC_QUIZ_STATE.activeQuizMessages.length - 1];
      refId = lastDaily?.id || null;
    }
    if (!refId) return;

    const active = SC_QUIZ_STATE.activeQuizMessages.find(x => x.id === refId);
    if (!active) return;

    const quizUser = message.author;

    // 2) carregar pergunta e extrair resposta VÁLIDA (letra OU texto)
    const qMain = SC_QUIZ_BANK.find(x => x.id === active.qid);
    const ans = scq_pickAnswerLetter(message.content, qMain);
    if (!ans) return; // não é letra nem texto exato → ignora sem apagar/contar

    // 3) apagar do chat só depois de validar
message.delete().catch(() => {});

// ✅ liberar próximos: houve interação “certa” (resposta válida)
if (SC_QUIZ_STATE.currentValidMessageId === refId) {
  SC_QUIZ_STATE.currentSatisfied = true;
}

// 5) marca participação e pontua
SC_QUIZ_STATE.participantsByMsg[refId] = SC_QUIZ_STATE.participantsByMsg[refId] || {};
SC_QUIZ_STATE.participantsByMsg[refId][quizUser.id] = true;
scq_save();


    const right = (ans === qMain.resposta);
   scq_updateLeaderboard(
  quizUser.id,
  right ? SC_QUIZ_POINTS_RIGHT : 0,
  right ? 0 : 1
);



    // 6) logs + feedback público
    await scq_log(scq_buildEmbed({
      title: right ? '✅ Resposta certa no chat' : '❌ Resposta errada no chat',
      description: [
        `Usuário: <@${quizUser.id}>`,
        `Pergunta: **${qMain.texto}**`,
        `Resposta recebida: \`${message.content}\``,
        `Gabarito: **${qMain.resposta}**`
      ].join('\n'),
      footer: `qid=${qMain.id}`
    }));

    const feedbackMsg = await message.channel.send({
      content: `<@${quizUser.id}>`,
      embeds: [scq_buildEmbed({
        title: right ? '🎉 Parabéns! Resposta correta' : '❌ Resposta incorreta',
        description: right
          ? `+${SC_QUIZ_POINTS_RIGHT} no ranking! Em breve te mando ${SC_QUIZ_EXTRA_DM_QUESTIONS} no PV.`
          : 'Não foi dessa vez… mas cola no PV que tem chance de recuperar!',
        image: GIF_QUIIZ_URL,
        color: right ? 0x2ECC71 : 0xE74C3C
      })],
      allowedMentions: { users: [quizUser.id] }
    });

    SC_QUIZ_STATE.lastPublicFeedbackMessageId = feedbackMsg.id;
    scq_save();

    // 7) DM com +3 perguntas
    let dm;
    try {
      dm = await quizUser.createDM();
    } catch (e) {
      await scq_log(scq_buildEmbed({
        title: '⚠️ Não consegui enviar DM',
        description: `Usuário: <@${quizUser.id}> — DMs fechadas.`,
        footer: 'Abrir DMs para participar do complemento do quiz.'
      }));
      return;
    }

    await dm.send({
      content: `<@${quizUser.id}>`,
      embeds: [scq_buildEmbed({
        title: '📥 QUIZ — Complemento no PV',
        description: [
          'Você tem **3 minutos** por pergunta.',
          'Responda com a **letra** (A/B/C/D) ou o **texto**.',
          'Boa sorte! 🍀'
        ].join('\n'),
        image: GIF_QUIIZ_URL
      })]
    });

    // Evita repetir as mesmas perguntas do principal
    const used = new Set([qMain.id]);
    let localRight = 0, localWrong = 0;

    for (let i = 0; i < SC_QUIZ_EXTRA_DM_QUESTIONS; i++) {
      const q = scq_getRandomQuestion(used);
      if (!q) break;
      used.add(q.id);

      const prompt = [
        `**${i+1}/${SC_QUIZ_EXTRA_DM_QUESTIONS}** — **${q.categoria}**`,
        `**${q.texto}**`,
        q.opcoes.map(x => `• ${x}`).join('\n'),
        '',
        '_Responda A/B/C/D ou o texto._'
      ].join('\n');

      await dm.send({
        embeds: [scq_buildEmbed({
          title: '❓ Pergunta',
          description: prompt,
          image: GIF_QUIIZ_URL
        })]
      });

      // Espera resposta (3 min)
      const collected = await dm.awaitMessages({
        filter: m => m.author.id === quizUser.id,
        max: 1,
        time: SC_QUIZ_DM_TIMEOUT_MS,
        errors: ['time']
      }).catch(() => null);

      if (!collected || !collected.first()) {
        await dm.send({ embeds: [scq_buildEmbed({
          title: '⏰ Tempo esgotado',
          description: 'Você não respondeu a tempo. Boa sorte na próxima!',
          image: GIF_QUIIZ_URL
        })]});

        await scq_log(scq_buildEmbed({
          title: '⏰ Timeout no PV',
          description: `Usuário: <@${quizUser.id}>\nPergunta: **${q.texto}**\nGabarito: **${q.resposta}**`,
          footer: `qid=${q.id}`
        }));
        scq_updateLeaderboard(quizUser.id, 0, 1);
        localWrong += 1;
        break; // encerra rodada no primeiro timeout
      } else {
        const reply = collected.first();
        const userAns = scq_normalizeAnswer(reply.content);
        const acerto =
          (userAns === q.resposta) ||
          userAns.includes(
            q.opcoes.find(o => o.startsWith(q.resposta))?.slice(3)?.toUpperCase() || ''
          );

        if (acerto) {
          localRight += 1;
          scq_updateLeaderboard(quizUser.id, 1, 0);
          await dm.send({ embeds: [scq_buildEmbed({
            title: '✅ Correto!',
            description: `Boa! Gabarito: **${q.resposta}**`,
            color: 0x2ECC71,
            image: GIF_QUIIZ_URL
          })]});
        } else {
          localWrong += 1;
          scq_updateLeaderboard(quizUser.id, 0, 1);
          await dm.send({ embeds: [scq_buildEmbed({
            title: '❌ Errou',
            description: `Gabarito correto: **${q.resposta}**`,
            color: 0xE74C3C,
            image: GIF_QUIIZ_URL
          })]});
        }

        await scq_log(scq_buildEmbed({
          title: acerto ? '✅ Acertou no PV' : '❌ Errou no PV',
          description: [
            `Usuário: <@${quizUser.id}>`,
            `Pergunta: **${q.texto}**`,
            `Resposta: \`${reply.content}\``,
            `Gabarito: **${q.resposta}**`
          ].join('\n'),
          footer: `qid=${q.id}`
        }));
      }
    }

    // Resumo PV
    const total = localRight + localWrong + 1; // inclui a do chat
    await dm.send({ embeds: [scq_buildEmbed({
      title: '📊 Resumo da sua rodada',
      description: `Chat: ${right?'✅':'❌'} · PV: ✅ ${localRight} · ❌ ${localWrong}\nTotal: ${total} pergunta(s).`,
      footer: 'Obrigado por participar!',
      image: GIF_QUIIZ_URL
    })]});

    // Atualiza ranking público (chat + PV)
    await scq_renderRankingSticky();

  } catch (e) {
    console.error("[SC_QUIZ] Erro no handleReply:", e);
  }
}


    


    // ============ AGENDA DIÁRIA ============
    function scq_pickTodayTimes() {
  const dayKey = scq_dayKey();
  if (SC_QUIZ_STATE.lastScheduleDayKey === dayKey) return; // já agendado hoje

  const today = new Date();
  const start = new Date(
    today.getFullYear(), today.getMonth(), today.getDate(),
    SC_QUIZ_WINDOW_START_HOUR, 0, 0, 0
  ).getTime();
  const end = new Date(
    today.getFullYear(), today.getMonth(), today.getDate(),
    SC_QUIZ_WINDOW_END_HOUR, 0, 0, 0
  ).getTime();

  const minGap = Math.max(0, SC_QUIZ_MIN_GAP_MINUTES) * 60 * 1000;
  const span = Math.max(1, end - start);
  const slots = Math.max(1, SC_QUIZ_DAILY_COUNT);
  const step = Math.floor(span / (slots + 1));

  // distribui no intervalo com um jitter leve de ±10min
  const times = [];
  for (let i = 1; i <= slots; i++) {
    let t = start + step * i + scq_randInt(-10, 10) * 60 * 1000;
    t = Math.min(Math.max(t, start), end - 1);
    times.push(t);
  }

  // reforça gap mínimo
  times.sort((a, b) => a - b);
  for (let i = 1; i < times.length; i++) {
    if (times[i] - times[i - 1] < minGap) {
      times[i] = times[i - 1] + minGap;
    }
  }

  // se estourou o fim da janela, puxa bloco inteiro pra trás mantendo gaps
  if (times[times.length - 1] > end) {
    const over = times[times.length - 1] - end + 60 * 1000;
    for (let i = 0; i < times.length; i++) times[i] -= over;
  }

  // evita passado (se já passou, joga pro futuro imediato mantendo ordem)
  const now = Date.now();
  for (let i = 0; i < times.length; i++) {
    if (times[i] < now) times[i] = now + (i + 1) * 10 * 60 * 1000;
  }

  SC_QUIZ_STATE.__todaySchedule = times;
  SC_QUIZ_STATE.lastScheduleDayKey = dayKey;
  scq_save();
  console.log("[SC_QUIZ] horários de hoje:", times.map(t => new Date(t).toTimeString().slice(0,5)).join(', '));
}


    let SC_QUIZ_TICK_INTERVAL = null;
    function scq_startTicker() {
      if (SC_QUIZ_TICK_INTERVAL) clearInterval(SC_QUIZ_TICK_INTERVAL);
      SC_QUIZ_TICK_INTERVAL = setInterval(async () => {
        try {
          scq_pickTodayTimes();
          const now = Date.now();
          const dueIndex = (SC_QUIZ_STATE.__todaySchedule || []).findIndex(t => t && now >= t);
          if (dueIndex >= 0) {
            // dispara e remove
            SC_QUIZ_STATE.__todaySchedule.splice(dueIndex,1);
            scq_save();
            await scq_postDailyQuiz();
          }
          // Vira o dia => replaneja
          const dayKey = scq_dayKey();
          if (SC_QUIZ_STATE.lastScheduleDayKey !== dayKey) {
            SC_QUIZ_STATE.lastScheduleDayKey = null; // força novo plano
          }
        } catch (e) {
          console.error("[SC_QUIZ] tick error:", e);
        }
      }, 5 * 1000); // checa a cada 15s
    }

    // ====== LISTENERS ======
client.once('ready', async () => {
  try {
    const creatorsCh = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(()=>null);
    if (!creatorsCh) {
      console.error("[SC_QUIZ] Não achei o canal creators. Verifique o ID.");
      return; // <- fecha o if e sai cedo pra evitar NPE
    }

    // ... (resto do ready permanece igual)

    await scq_renderRankingSticky();
    scq_startTicker();

    if (typeof sc_rt_startTickerFast === 'function') {
      sc_rt_startTickerFast();
    } else {
      console.warn('[SC_RT] startTickerFast não carregou — verifique o bloco.');
    }

    console.log("[SC_QUIZ] Pronto e agendado. 🧠 (inclui relâmpago)");
  } catch (e) {
    console.error("[SC_QUIZ] erro no ready:", e);
  }
});

// ✅ fora do ready
client.on('messageDelete', async (msg) => {
  try {
    // se apagaram a mensagem “válida”, não libera automaticamente a fila
    if (SC_QUIZ_STATE.currentValidMessageId === msg.id) {
      scq_save();
    }

    if (SC_QUIZ_STATE.currentQuizChannelMessageId === msg.id) {
      SC_QUIZ_STATE.currentQuizChannelMessageId = null;
    }

    if (SC_QUIZ_STATE.lastPublicFeedbackMessageId === msg.id) {
      SC_QUIZ_STATE.lastPublicFeedbackMessageId = null;
    }

    // relâmpago
    if (SC_QUIZ_STATE.rt?.active && msg.id === SC_QUIZ_STATE.rt.active.messageId) {
      SC_QUIZ_STATE.rt.active = null;
      if (SC_QUIZ_STATE.rt.attempts) delete SC_QUIZ_STATE.rt.attempts[msg.id];
    }

    // diário
    const idx = (SC_QUIZ_STATE.activeQuizMessages || []).findIndex(m => m.id === msg.id);
    if (idx >= 0) {
      const removed = SC_QUIZ_STATE.activeQuizMessages.splice(idx, 1)[0];
      if (removed) delete SC_QUIZ_STATE.participantsByMsg[removed.id];
    }

    scq_save();
  } catch {}
});





  

    client.on('messageCreate', async (message) => {
  try {
    if (!message?.author || message.author.bot) return;

    // ===== gatilho por atividade (contador) =====
    if (message.guild && message.channelId === SC_QUIZ_CREATORS_CHANNEL_ID) {
      globalThis.SC_CHAT_MSG_COUNTER = (globalThis.SC_CHAT_MSG_COUNTER || 0) + 1;
      const SC_CHAT_MSG_THRESHOLD = 30;

      if (globalThis.SC_CHAT_MSG_COUNTER >= SC_CHAT_MSG_THRESHOLD) {
        globalThis.SC_CHAT_MSG_COUNTER = 0;

        const choice = Math.random() < 0.5 ? 'daily' : 'fast';
        if (choice === 'daily') {
          console.log("[SC_QUIZ] Disparando Quiz Diário por atividade...");
          await scq_postDailyQuiz(false);  // não força; respeita bloqueio
        } else {
          console.log("[SC_QUIZ] Disparando Quiz Relâmpago por atividade...");
          await sc_rt_postFastQuiz(false); // não força; respeita bloqueio
        }
      }
    }
    // ===== fim gatilho por atividade =====

    // ===== roteamento de respostas no canal do quiz =====
    if (message.channelId === SC_QUIZ_CREATORS_CHANNEL_ID) {
      const replyTo = message.reference?.messageId || null;

      // a) COM reply → decide entre relâmpago vs diário
      if (replyTo) {
        if (SC_QUIZ_STATE.rt?.active && SC_QUIZ_STATE.rt.active.messageId === replyTo) {
          await sc_rt_handlePotentialAnswer(message); // relâmpago
        } else {
          await scq_handleDailyAnswer(message);       // diário
        }
        return;
      }

      // b) SEM reply → só processa se for UMA letra (A–D)
      const txt = message.content?.trim() || '';
      if (!/^[A-D]$/i.test(txt)) return;

      // decide pelo mais recente (fast vs daily)
      const lastDaily = SC_QUIZ_STATE.activeQuizMessages[SC_QUIZ_STATE.activeQuizMessages.length - 1] || null;
      const fastAct   = SC_QUIZ_STATE.rt?.active || null;
      const dailyAt   = lastDaily?.createdAt || 0;
      const fastAt    = fastAct?.createdAt || 0;

      if (fastAt > dailyAt) await sc_rt_handlePotentialAnswer(message);
      else if (dailyAt > 0) await scq_handleDailyAnswer(message);

      return;
    }

    // ===== comandos de operador =====
    if (message.content?.trim().startsWith('!fastid ')) {
      const allowed = ['1262262852949905408','660311795327828008'];
      if (!allowed.includes(message.author.id)) return;
      const idStr = message.content.trim().split(/\s+/)[1];
      if (!idStr || isNaN(Number(idStr))) {
        await message.reply('Uso: `!fastid <id>` (ex.: `!fastid 37`)').catch(()=>{});
      } else {
        await sc_rt_postFastQuizById(Number(idStr), false); // respeita a trava
        await message.react('⚡').catch(()=>{});
      }
      return;
    }

    if (message.content?.trim() === '!fastnow') {
      const allowed = ['1262262852949905408','660311795327828008'];
      if (!allowed.includes(message.author.id)) return;
      await sc_rt_postFastQuiz(false); // respeita a trava
      await message.react('⚡').catch(()=>{});
      return;
    }

    if (message.content?.trim().startsWith('!fastlist')) {
      const allowed = ['1262262852949905408','660311795327828008'];
      if (!allowed.includes(message.author.id)) return;

      const page = Math.max(1, Number(message.content.trim().split(/\s+/)[1] || 1));
      const perPage = 10;
      const start = (page - 1) * perPage;
      const slice = SC_RT_BANK.slice(start, start + perPage);

      if (!slice.length) {
        await message.reply(`Página vazia. Temos ${Math.ceil(SC_RT_BANK.length/perPage)} páginas.`).catch(()=>{});
      } else {
        const lines = await Promise.all(slice.map(async (q) => {
          const preview = q.texto.length > 60 ? q.texto.slice(0,60)+'…' : q.texto;
          return `\`${q.id}\` — **${q.categoria}** — ${preview}`;
        }));
        await message.reply({
          embeds: [scq_buildEmbed({
            title: `📚 FASTLIST — página ${page}`,
            description: lines.join('\n'),
            footer: `Total: ${SC_RT_BANK.length} perguntas | use !fastlist <página> | poste com !fastid <id>`
          })]
        }).catch(()=>{});
      }
      return;
    }

    if (message.content?.trim() === '!quiznow') {
      const allowed = [ '1262262852949905408','660311795327828008' ];
      if (!allowed.includes(message.author.id)) return;
      await scq_postDailyQuiz(false);  // deixa explícito que não força
      await message.react('✅').catch(()=>{});
      return;
    }

  } catch (e) {
    console.error("[SC_QUIZ] erro no messageCreate:", e);
  }
});



  } catch (err) {
    console.error("[SC_QUIZ] Falha geral:", err);
  }
})();
