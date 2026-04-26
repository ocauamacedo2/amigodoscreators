// ===================================================================
// 🧩 TOPO PADRONIZADO (COMPATÍVEL COM MÓDULOS DO BOT PRINCIPAL)
// ===================================================================

// ---- Variáveis de ambiente ----
import { setupQuiz } from './events/quiz.js';
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
const SC_QUIZ_RANKING_CHANNEL_ID  = '1495330319715532880';   // ranking público
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
  creatorsCleanupMessageIds: []
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
SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds || [];

// ========= ESTADO/PERSISTÊNCIA ========= (logo depois do SC_QUIZ_STATE ser criado)
SC_QUIZ_STATE.currentValidMessageId = SC_QUIZ_STATE.currentValidMessageId || null; // msg “oficial” (daily OU fast)
SC_QUIZ_STATE.currentSatisfied      = SC_QUIZ_STATE.currentSatisfied ?? true;     // true = pode postar outro

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
  'Boa comunicação, presença e produtividade',
  'Respeito, postura e consciência',
  'Comprometimento, resultado e constância',
  'Postura firme, criatividade e iniciativa'
], 1);

addS('Conduta', 'A entrevista serve principalmente para:', [
  'Validar se a pessoa tem perfil e veste a camisa',
  'Liberar cargo após aprovação técnica',
  'Ver se a pessoa veste a camisa de verdade',
  'Avaliar postura antes da integração final'
], 2);

addS('Conduta', 'Problemas da empresa devem ser resolvidos como?', [
  'Nos canais corretos e com organização',
  'Diretamente com quem estiver disponível',
  'Com alinhamento interno e registro correto',
  'Nos canais corretos e com liderança ciente'
], 0);

addS('Conduta', 'A hierarquia dentro da SantaCreators é vista como:', [
  'Uma referência visual de cargos',
  'Estrutura com função e responsabilidade',
  'Uma divisão de áreas com autonomia',
  'Uma organização formal de liderança'
], 1);

addS('Conduta', 'Cada membro possui um canal privado com seu nome para:', [
  'Resolver questões internas com mais agilidade',
  'Tirar dúvidas e pedir ajuda com segurança',
  'Receber orientações e registrar necessidades',
  'Tratar pendências com acompanhamento'
], 1);

addS('Conduta', 'Qual destas atitudes pode gerar expulsão mesmo se foi "brincadeira"?', [
  'Debochar de regra interna em alinhamento',
  'Ofender alguém com preconceito',
  'Insistir em brincadeira pesada com membro',
  'Racismo, homofobia ou transfobia'
], 3);

addS('Conduta', 'Se você decidir sair da SantaCreators, o procedimento correto é:', [
  'Avisar seu responsável e aguardar orientação final',
  'Pedir demissão em game para a equipe',
  'Solicitar desligamento no setor responsável',
  'Comunicar a liderança antes de remover qualquer coisa'
], 1);

addS('Conduta', 'A idade mínima permitida para participar da SantaCreators é:', [
  '14 anos',
  '15 anos',
  '16 anos',
  '15 anos completos ou quase completos'
], 1);

addS('Conduta', 'Familiares podem atuar juntos na equipe?', [
  'Sim, desde que não estejam na mesma área',
  'Não, por questões éticas e organizacionais',
  'Somente em setores sem poder de decisão',
  'Apenas se houver autorização prévia da liderança'
], 1);

addS('Conduta', 'Se houver vínculo familiar com alguém da equipe, o correto é:', [
  'Informar no momento da entrada ou assim que possível',
  'Avisar imediatamente a liderança responsável',
  'Registrar com o responsável direto antes de atuar',
  'Deixar isso alinhado com a gestão desde o início'
], 1);

// =========================
// IMERSÃO / RP
// =========================
addS('Imersão', 'No meio do RP, falar "meu Discord caiu" é:', [
  'Uma justificativa aceitável em situação urgente',
  'Quebra de imersão',
  'Uma quebra leve, mas tolerável',
  'Algo evitável, mas compreensível'
], 1);

addS('Imersão', 'Se ocorrer bug ou alguém estiver flutuando, o mais correto é:', [
  'Usar uma justificativa criativa dentro da narrativa',
  'Evitar comentar e seguir o RP normalmente',
  'Contornar a situação sem quebrar a cena',
  'Improvisar algo coerente com o contexto'
], 0);

addS('Imersão', 'Se estiver sem microfone no RP, uma substituição mais imersiva seria:', [
  'Minha voz falhou do nada',
  'Minha garganta tá ruim',
  'Hoje eu tô rouco pra caramba',
  'Minha cabeça tá doendo pra falar'
], 1);

addS('Imersão', 'Trocar de roupa na frente de outros players, sem contexto, é:', [
  'Uma quebra de imersão',
  'Uma atitude evitável no RP',
  'Algo incoerente com a cena',
  'Um comportamento fora do ideal'
], 0);

addS('Imersão', 'Ao precisar sair da cidade/logar off perto de outros players, o melhor é:', [
  'Encerrar a cena rapidamente e sair',
  'Sair de forma imersiva e em local adequado',
  'Buscar uma justificativa coerente e se retirar',
  'Evitar desaparecer no meio da interação'
], 1);

addS('Imersão', 'Usar palavras do mundo exterior diretamente no RP deve ser:', [
  'Controlado para não atrapalhar a cena',
  'Evitado',
  'Usado apenas quando não houver opção',
  'Substituído por falas mais imersivas'
], 1);

addS('Imersão', 'A frase "tô com os olhos abertos" é usada para substituir:', [
  'Tô sem áudio',
  'Tô em live',
  'Tô mutado',
  'Tô só ouvindo'
], 1);

addS('Imersão', 'Usar comandos do F8 para flutuar ou sentar no ar sem sentido no RP é:', [
  'Uma quebra desnecessária de imersão',
  'Uma conduta a ser evitada',
  'Um comportamento inadequado em cena',
  'Algo que compromete a seriedade do RP'
], 1);

// =========================
// UNIFORME / PRÉDIO / VEÍCULOS
// =========================
addS('Uniforme', 'Dentro do prédio da SantaCreators, o uso obrigatório é de:', [
  'Ao menos uma peça visível da empresa',
  'Jaqueta da SantaCreators',
  'Uniforme oficial ou peça principal da empresa',
  'Identificação visual da empresa'
], 1);

addS('Uniforme', 'Nas proximidades do prédio, o membro deve usar:', [
  'Ao menos uma peça da SantaCreators',
  'Uma identificação discreta da empresa',
  'Uniforme parcial visível para reconhecimento',
  'Peça oficial compatível com o ambiente'
], 0);

addS('Uniforme', 'Para usar as garagens da empresa, é necessário:', [
  'Ter cargo e estar identificado',
  'Estar com ao menos uma peça da SantaCreators',
  'Estar com uniforme visível da empresa',
  'Ter vínculo ativo e roupa compatível'
], 1);

addS('Uniforme', 'Se a pessoa entrar no prédio sem a jaqueta, o correto é:', [
  'Ajustar o uniforme em local reservado',
  'Ir a uma sala sozinho e vestir a peça',
  'Se retirar por um momento e regularizar a roupa',
  'Corrigir a vestimenta sem expor a cena'
], 1);

addS('Veículos', 'Usar veículos da SantaCreators para troca de tiro é:', [
  'Totalmente inadequado e proibido',
  'Proibido',
  'Vedado mesmo em situação emergencial',
  'Não autorizado em hipótese normal'
], 1);

addS('Veículos', 'Usar veículos do prédio para assalto de pista é:', [
  'Incompatível com o uso da empresa',
  'Proibido',
  'Vedado por desvio de finalidade',
  'Não autorizado para ações criminais'
], 1);

addS('Veículos', 'Sequestro com veículo da empresa só é permitido quando:', [
  'Houver contexto aprovado e situação específica',
  'Houver RP organizado e dentro do horário permitido',
  'Existir autorização de liderança e cenário coerente',
  'For uma ação alinhada e dentro da regra'
], 1);

addS('Uniforme', 'Em ações ilegais fora da sede, o uso do uniforme é:', [
  'Desaconselhado, salvo ordem superior',
  'Proibido, devendo trocar de roupa antes',
  'Inadequado por expor a empresa',
  'Vedado para preservar a identificação'
], 1);

addS('Uniforme', 'Trocar de roupa na frente de outros players durante ação externa é:', [
  'Errado, devendo ser feito em local privado',
  'Inadequado, salvo em local seguro e isolado',
  'Uma quebra evitável de coerência',
  'Algo que só deveria ocorrer fora de vista'
], 0);

// =========================
// BAÚS
// =========================
addS('Baús', 'O baú pessoal da SantaCreators é:', [
  'De uso individual do membro responsável',
  'Uso livre e exclusivo do membro',
  'Reservado ao uso particular autorizado',
  'Um espaço pessoal vinculado ao membro'
], 1);

addS('Baús', 'No baú geral, o uso correto é:', [
  'Usar com consciência e sem exagero',
  'Usar com bom senso e pensar nos colegas',
  'Retirar apenas o que realmente vai utilizar',
  'Fazer uso equilibrado pensando no coletivo'
], 1);

addS('Baús', 'No baú geral, qual destas opções respeita a regra?', [
  'Pegar apenas o suficiente para a demanda atual',
  'Pegar somente o necessário para consumo próprio',
  'Retirar o básico sem prejudicar os demais',
  'Usar com limite e sem estocar'
], 1);

addS('Baús', 'O baú creators serve para:', [
  'Doações, repasses e entregas da equipe',
  'Doações e entregas, sem retirada',
  'Armazenar itens destinados à operação interna',
  'Recebimentos da equipe sem uso pessoal'
], 1);

addS('Baús', 'Retirar item do baú creators é:', [
  'Proibido',
  'Vedado salvo autorização expressa',
  'Não permitido para uso comum',
  'Incompatível com a finalidade do baú'
], 0);

addS('Baús', 'No baú de vendas, a divisão correta é:', [
  '60% para você e 40% painel',
  '70% para você e 30% painel',
  '50% para você e 50% para o painel',
  '40% para você e 60% painel'
], 2);

addS('Baús', 'Se alguém usar o baú de vendas e não dividir corretamente, a punição prevista é:', [
  'Advertência grave e devolução',
  'Ban imediato',
  'Punição severa por desvio',
  'Desligamento por quebra de confiança'
], 1);

addS('Baús', 'O baú coordenação é voltado para:', [
  'Organização interna de metas e entregas',
  'Materiais de apoio da coordenação',
  'Itens voltados ao controle interno',
  'Demandas operacionais da liderança'
], 0);

addS('Baús', 'O baú responsável pode ser acessado por:', [
  'Somente a RESP',
  'Apenas liderança máxima da área',
  'Exclusivamente a responsável da equipe',
  'Somente quem ocupa a função de RESP'
], 0);

// =========================
// PODERES / ANTI-RP
// =========================
addS('Poderes', 'Os poderes da SantaCreators existem para:', [
  'Apoio operacional e controle da empresa',
  'Fins administrativos e empresariais',
  'Organização estrutural e necessidade interna',
  'Gestão de demandas sem benefício pessoal'
], 1);

addS('Poderes', 'Usar comando para ir até um amigo no outro lado da cidade durante o RP é:', [
  'Uso indevido da função',
  'Abuso de poder',
  'Desvio da finalidade do comando',
  'Aproveitamento irregular de privilégio'
], 1);

addS('Poderes', 'A regra de ouro sobre poderes é:', [
  'Você só pode usar quando houver justificativa interna',
  'Se um player comum não pode, você também não pode',
  'Poder não existe para te dar vantagem no RP',
  'Se fugir da lógica do player comum, está errado'
], 1);

addS('Poderes', 'Usar noclip sem necessidade, fora de demanda da empresa, é:', [
  'Uso incorreto de ferramenta administrativa',
  'Abuso de poder',
  'Conduta proibida por desvio de função',
  'Ação irregular fora do contexto empresarial'
], 1);

addS('Poderes', 'Se morrer em uma ação de RP, o correto é:', [
  'Aguardar suporte adequado dentro da cena',
  'Chamar médico ou ir para os bombeiros',
  'Seguir o fluxo normal de atendimento do RP',
  'Prosseguir como qualquer player comum'
], 1);

addS('Poderes', 'Se alguém cometer anti-rp contra você, o primeiro passo correto é:', [
  'Guardar as provas e levar para análise',
  'Clipar tudo e pegar os passaportes',
  'Registrar a situação com evidência completa',
  'Coletar material antes de qualquer ação'
], 1);

addS('Poderes', 'Em caso de anti-rp sofrido, você nunca deve:', [
  'Resolver por conta própria usando comando',
  'Usar seus poderes para resolver na hora',
  'Punir sem fluxo e sem registro',
  'Interferir como staff no calor da cena'
], 1);

addS('Poderes', 'Sem alinhamento e sem autorização, o uso de comando da gestão deve ser:', [
  'Restringido ao mínimo necessário',
  'Evitado',
  'Suspenso até confirmação superior',
  'Não utilizado fora de necessidade clara'
], 1);

addS('Poderes', 'Na dúvida sobre usar um poder, a orientação correta é:', [
  'Perguntar antes',
  'Confirmar com liderança antes da ação',
  'Validar o contexto antes de usar',
  'Checar autorização antes de executar'
], 0);

// =========================
// CALL / ORGANIZAÇÃO / PONTO
// =========================
addS('Organização', 'Ficar em call na cidade é obrigatório para todos?', [
  'Não',
  'Depende do setor e da função',
  'Apenas em situações específicas',
  'Não de forma geral para todos'
], 0);

addS('Organização', 'Para quem busca entrosamento, aprendizado e evolução, a call é:', [
  'Importante para evolução e acompanhamento',
  'Altamente recomendada',
  'Muito útil para integração da equipe',
  'Quase essencial para quem quer crescer'
], 1);

addS('Organização', 'Responsáveis têm obrigação de:', [
  'Acompanhar a equipe com constância',
  'Ficar em call para ajudar a equipe',
  'Estar disponíveis para suporte e orientação',
  'Dar assistência ativa à operação'
], 1);

addS('Organização', 'Alinhamentos na SantaCreators acontecem:', [
  'Em call com o responsável',
  'Em reunião com liderança da área',
  'Em call estruturada com quem acompanha você',
  'Em conversa orientada com o responsável direto'
], 0);

addS('Organização', 'Sempre que usar poderes, você deve:', [
  'Registrar no canal adequado ao fim do uso',
  'Registrar no final do dia no canal correto',
  'Garantir que o uso ficou documentado',
  'Formalizar o registro no fluxo correto'
], 1);

addS('Organização', 'O bate ponto da SantaCreators funciona em quais horários?', [
  '17:00 às 23:00 e 01:00 às 04:00',
  '18:00 às 23:00 e 00:00 às 03:00',
  '17:00 às 22:00 e 01:00 às 04:00',
  '17:00 às 23:00 e 00:00 às 04:00'
], 0);

addS('Organização', 'Atualmente, qual destes itens gera pontos no sistema?', [
  'Registro de poderes utilizados',
  'Registro correto de uso de poder',
  'Lançamento de poder em canal apropriado',
  'Documentação do uso administrativo'
], 0);

addS('Organização', 'A regra sobre registros importantes é:', [
  'Registrar uma única vez dentro do fluxo correto',
  'Registrar somente uma vez por dia, quando necessário',
  'Evitar duplicidade e registrar com responsabilidade',
  'Documentar apenas quando realmente couber'
], 1);

// =========================
// ADVERTÊNCIAS / PRESENÇA
// =========================
addS('Advertência', 'Qual destas situações pode gerar advertência nas proximidades da sede?', [
  'Estar sem identificação da empresa',
  'Circular sem peça oficial visível',
  'Estar perto da sede sem vestimenta adequada',
  'Ignorar o padrão visual exigido na área'
], 0);

addS('Advertência', 'Qual destes exemplos representa quebra de imersão?', [
  'Minha mãe tá me chamando',
  'Meu telefone tocou aqui agora',
  'Minha internet oscilou do nada',
  'Tive um problema aqui fora do RP'
], 0);

addS('Advertência', 'Má conduta envolve:', [
  'Postura inadequada e tratamento desrespeitoso',
  'Falta de respeito e respostas debochadas',
  'Comportamento incompatível com a função',
  'Atitudes sem educação e sem postura'
], 1);

addS('Advertência', 'Para cargos Coord.+, Resp. Líder e Resp. Influ, os eventos das 19:00 são:', [
  'Obrigatórios',
  'Compromissos fixos da liderança',
  'De presença esperada salvo justificativa',
  'Parte da obrigação dos cargos citados'
], 0);

addS('Advertência', 'Caso não possa comparecer ao evento das 19:00, é obrigatório:', [
  'Registrar ausência até 18:30 com justificativa',
  'Informar ausência antes do horário-limite',
  'Formalizar justificativa antes do evento',
  'Avisar no fluxo correto dentro do prazo'
], 0);

addS('Advertência', 'Falta sem presença e sem justificativa dentro do prazo gera:', [
  'ADV 1/3 e -5 pontos',
  'Advertência com desconto de pontuação',
  'Penalidade por ausência sem cobertura',
  'Punição padrão por falta injustificada'
], 0);

addS('Advertência', 'Ao atingir 3/3 de ADV, acontece:', [
  'Avaliação de permanência e possível redefinição',
  'Revisão da continuidade e da posição ocupada',
  'Reavaliação da permanência e da posição',
  'Análise final sobre permanência na equipe'
], 2);

// =========================
// HIERARQUIA / GI
// =========================
addS('Hierarquia', 'A gestaoinfluencer é:', [
  'Uma divisão interna da própria SantaCreators',
  'O núcleo interno da própria SantaCreators',
  'Um setor avançado da estrutura principal',
  'Uma extensão interna da equipe Creators'
], 1);

addS('Hierarquia', 'O acesso à gestaoinfluencer acontece por:', [
  'Reconhecimento interno e convite por evolução',
  'Convite baseado em evolução e confiança',
  'Convite após destaque consistente e confiança',
  'Entrada por mérito e observação da liderança'
], 1);

addS('Hierarquia', 'O nível 3 da estrutura oficial da SantaCreators é:', [
  'Creator',
  'Base operacional da equipe',
  'Faixa dos creators na estrutura',
  'Nível de entrada após liderança'
], 0);

addS('Hierarquia', 'No nível 2 ficam funções como:', [
  'Social Médias, Manager e Gestor',
  'Cargos intermediários como Social, Manager e Gestor',
  'As áreas técnicas e operacionais acima da base',
  'Funções de suporte e desenvolvimento da equipe'
], 0);

addS('Hierarquia', 'O nível 1 da SantaCreators é formado por:', [
  'Os cargos responsáveis da liderança',
  'A liderança principal da estrutura',
  'Os responsáveis máximos da equipe',
  'A camada mais alta de decisão'
], 0);

addS('Hierarquia', 'O caminho normal até a gestaoinfluencer é:', [
  'Participar, evoluir e ser convidado',
  'Crescer na equipe até ser observado',
  'Se destacar até receber oportunidade interna',
  'Evoluir de forma consistente até o convite'
], 0);

// =========================
// SOCIAL MÉDIAS
// =========================
addS('Social Médias', 'A principal função da Social Médias é:', [
  'Estruturar, organizar e manter a agenda de eventos',
  'Organizar e estruturar os eventos da SantaCreators',
  'Planejar o cronograma e a execução dos eventos',
  'Coordenar a parte operacional dos eventos da equipe'
], 1);

addS('Social Médias', 'Os eventos da SantaCreators acontecem em quais dias?', [
  'Segunda a sábado',
  'De segunda até sábado',
  'Ao longo da semana, exceto domingo',
  'Seis dias por semana, sem domingo'
], 0);

addS('Social Médias', 'O horário padrão dos eventos é:', [
  '19:00',
  '20:00 com chamada antes',
  '19:00 como horário-base',
  'Por volta das 19:00'
], 0);

addS('Social Médias', 'O cronograma da semana deve ser organizado em qual dia?', [
  'Domingo',
  'No domingo anterior à semana',
  'Ao longo do domingo com fechamento final',
  'Domingo, antes do início da nova agenda'
], 0);

addS('Social Médias', 'Na montagem do cronograma, não pode repetir:', [
  'O mesmo evento na mesma cidade e mesmo dia da semana anterior',
  'A mesma combinação da semana anterior',
  'O mesmo formato repetido na mesma posição da agenda',
  'Evento igual no mesmo recorte da semana passada'
], 0);

addS('Social Médias', 'A divulgação do evento deve ser feita no dia do evento entre:', [
  '00:00 e 17:00',
  'Até 17:00 do dia do evento',
  'Dentro da janela da manhã e tarde do mesmo dia',
  'No próprio dia, antes do período da noite'
], 0);

addS('Social Médias', 'Após o evento, a equipe deve registrar presença no canal de:', [
  'Poderes em evento',
  'Registro de presença do evento',
  'Canal operacional de presença da equipe',
  'Canal de presença vinculado ao evento'
], 0);

addS('Social Médias', 'Na premiação, VIPs comerciais como Ouro e Platinum exigem autorização de:', [
  'Macedo ou diretoria da cidade',
  'Diretoria responsável pela cidade',
  'Macedo ou autoridade máxima da cidade',
  'Autorização superior da cidade junto ao Macedo'
], 0);

// =========================
// MANAGER
// =========================
addS('Manager', 'A missão da equipe Manager Creators é:', [
  'Garantir presença das organizações nos eventos',
  'Garantir organizações presentes nos eventos',
  'Atuar para levar organizações à agenda da equipe',
  'Fazer a ponte entre eventos e lideranças convidadas'
], 1);

addS('Manager', 'Os eventos com maior contingente para atuação dos Managers são:', [
  'Quinta, sexta e sábado',
  'A reta final da semana',
  'Os dias de maior movimento da agenda',
  'Quinta a sábado, principalmente'
], 0);

addS('Manager', 'O prazo para registrar organizações vai de:', [
  'Domingo 00:00 até quinta 16:00',
  'Do domingo até quinta às 16:00',
  'Do início da semana até quinta no fim da tarde',
  'De domingo até quinta-feira antes do evento'
], 0);

addS('Manager', 'Para convidar uma organização, o contato deve ser feito com:', [
  'Diretamente com um líder da organização',
  'Com liderança oficial da organização',
  'Com alguém que represente a liderança da facção',
  'Com o líder ou responsável oficial da organização'
], 0);

addS('Manager', 'Registrar organização sem falar com o líder é:', [
  'Errado',
  'Incorreto por fugir do procedimento',
  'Inválido sem contato com liderança',
  'Fora do padrão exigido para registro'
], 0);

addS('Manager', 'Como Manager, você é staff?', [
  'Não',
  'Não, apesar de representar a equipe',
  'Não, a função não equivale a staff',
  'Não, mesmo atuando em nome da equipe'
], 0);

addS('Manager', 'No RP, convidar organização dentro do NC é:', [
  'Proibido',
  'Incompatível com o RP da função',
  'Errado por fugir da imersão',
  'Vedado dentro do contexto de NC'
], 0);

addS('Manager', 'Cada organização registrada gera para o Manager:', [
  'Pontos no sistema',
  'Pontuação no sistema interno',
  'Registro convertido em pontuação',
  'Ponto contabilizado no sistema'
], 0);

// =========================
// GESTOR
// =========================
addS('Gestor', 'A principal missão do Gestor Creators é:', [
  'Formar e orientar quem está começando',
  'Acompanhar e desenvolver membros em início',
  'Conduzir a evolução de quem entra na equipe',
  'Dar base, direção e orientação aos novatos'
], 0);

addS('Gestor', 'Para ser Gestor Creators, a pessoa deve ter vindo de:', [
  'Social Médias ou Manager Creators',
  'Áreas-base de desenvolvimento da equipe',
  'Setores como Social ou Manager',
  'Funções anteriores ligadas à operação'
], 0);

addS('Gestor', 'O Gestor ensina principalmente quem está em fase:', [
  'Inicial da equipe',
  'De adaptação dentro da operação',
  'De entrada e aprendizado',
  'De começo na trajetória interna'
], 0);

addS('Gestor', 'Os feedbacks do Gestor devem ser:', [
  'Detalhados, com qualidades, erros e evolução',
  'Completos, claros e voltados ao desenvolvimento',
  'Objetivos, construtivos e bem explicados',
  'Profundos o bastante para orientar melhoria'
], 0);

addS('Gestor', 'Sempre que ensinar algo a alguém da equipe, o Gestor deve:', [
  'Registrar o ensinamento',
  'Documentar o que foi orientado',
  'Formalizar o alinhamento realizado',
  'Deixar registrado o conteúdo ensinado'
], 0);

addS('Gestor', 'Ao registrar alinhamento, deve ser informado:', [
  'O ID Discord da pessoa alinhada',
  'A identificação correta de quem recebeu o alinhamento',
  'O Discord ID do membro alinhado',
  'O ID do usuário que foi orientado'
], 0);

addS('Gestor', 'Ser Gestor substitui a função anterior da pessoa?', [
  'Não, ela continua na função de origem também',
  'Não, a função anterior segue junto',
  'Não, o Gestor soma à área de origem',
  'Não, ela mantém a base anterior acumulada'
], 0);

// =========================
// COORD
// =========================
addS('Coordenação', 'O Coord Creators é visto como:', [
  'Braço direito da liderança e quem faz tudo funcionar',
  'Pilar operacional da liderança no dia a dia',
  'Quem sustenta a execução e a organização da equipe',
  'Figura central para fazer a operação rodar'
], 0);

addS('Coordenação', 'O Coord precisa dominar quais áreas?', [
  'Social, Manager e Gestor',
  'As três áreas-base da operação',
  'Social, gestão de convites e desenvolvimento',
  'Os setores centrais de funcionamento da equipe'
], 0);

addS('Coordenação', 'Se faltar alguém em uma área da equipe, o Coord deve:', [
  'Assumir temporariamente para nada quebrar',
  'Cobrir a demanda até normalizar a operação',
  'Entrar na função necessária para manter a equipe rodando',
  'Segurar a ponta até a área se reorganizar'
], 0);

addS('Coordenação', 'Além de executar funções, o Coord também deve:', [
  'Coordenar e acompanhar as equipes',
  'Gerir, observar e acompanhar os setores',
  'Supervisionar o andamento das áreas da equipe',
  'Manter controle sobre execução e desempenho das equipes'
], 0);

addS('Coordenação', 'O próximo passo natural de evolução do Coord Creators é:', [
  'Resp Líder',
  'Subir para a camada de responsável',
  'Avançar para liderança responsável',
  'Migrar para a próxima faixa da hierarquia'
], 0);

// =========================
// RESPONSÁVEIS
// =========================
addS('Responsáveis', 'O Resp Líder deve acompanhar principalmente se:', [
  'A equipe está organizada e a coordenação está funcionando',
  'A estrutura está fluindo sem travas',
  'A coordenação sustenta bem a operação',
  'A liderança intermediária está executando corretamente'
], 0);

addS('Responsáveis', 'Se houver membro iniciante presente, o Resp Líder deve:', [
  'Dar suporte e garantir orientação adequada',
  'Ensinar e orientar na hora',
  'Acompanhar o iniciante de forma ativa',
  'Aproveitar a presença para desenvolver o membro'
], 1);

addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
  'Banimento do painel e do Discord com regra e evidência',
  'Punições severas quando houver base e prova',
  'Sanções estruturais com respaldo da regra',
  'Medidas de alto impacto mediante evidência'
], 0);

addS('Responsáveis', 'O Resp Creators é:', [
  'Responsável máximo pela operação da equipe Creators',
  'A principal autoridade da operação Creators',
  'Quem responde pela estrutura geral da equipe',
  'O topo da gestão operacional da Creators'
], 0);

addS('Responsáveis', 'Entre as responsabilidades do Resp Creators está:', [
  'Aprovar premiações de eventos e supervisionar decisões importantes',
  'Validar decisões sensíveis e acompanhar premiações',
  'Supervisionar pontos críticos e autorizações relevantes',
  'Responder pelas decisões importantes e aprovações finais'
], 0);

addS('Responsáveis', 'Na hierarquia final da equipe, a ordem correta de subida é:', [
  'Social/Manager > Gestor > Coord > Resp Líder > Resp Influ > Resp Creators',
  'Social > Manager > Gestor > Coord > Resp Líder > Resp Influ > Resp Creators',
  'Social/Manager > Coord > Gestor > Resp Líder > Resp Influ > Resp Creators',
  'Manager/Social > Gestor > Coord > Resp Influ > Resp Líder > Resp Creators'
], 0);

// =========================
// NOVAS PERGUNTAS — BANCO EXTRA (MÉDIA)
// =========================

// CONDUTA / BASE GERAL
addS('Conduta', 'A SantaCreators se define principalmente como:', [
  'Uma empresa organizada de RP',
  'Um grupo livre sem cobrança',
  'Uma guilda casual para eventos',
  'Uma equipe focada apenas em painel'
], 0);

addS('Conduta', 'Além da criação de conteúdo, a SantaCreators valoriza muito:', [
  'Somente número e resultado',
  'Imersão, responsabilidade e crescimento',
  'Apenas presença em call',
  'Exclusivamente eventos semanais'
], 1);

addS('Conduta', 'As perguntas da entrevista servem para mostrar principalmente:', [
  'Se a pessoa decora respostas rápido',
  'Se a pessoa sabe copiar regras',
  'Se a pessoa tem postura e entende o peso da empresa',
  'Se a pessoa conhece todos os canais do Discord'
], 2);

addS('Conduta', 'Na SantaCreators, problemas internos devem ser resolvidos:', [
  'Por DM para ser mais rápido',
  'Nos canais corretos com organização',
  'Somente em call com qualquer pessoa',
  'Em conversa privada fora do Discord'
], 1);

addS('Conduta', 'Ter um canal privado com seu nome significa que:', [
  'Você pode ignorar a liderança',
  'É um espaço seguro para resolver dúvidas e pendências',
  'Serve apenas para receber punições',
  'É um canal decorativo da empresa'
], 1);

addS('Conduta', 'A participação de menores de 15 anos na SantaCreators é:', [
  'Permitida com autorização',
  'Permitida só no painel',
  'Proibida',
  'Aceita apenas em teste'
], 2);

addS('Conduta', 'Se houver vínculo familiar com alguém da equipe, o correto é:', [
  'Esconder para evitar confusão',
  'Avisar imediatamente a liderança responsável',
  'Falar apenas se alguém descobrir',
  'Continuar normalmente sem comentar'
], 1);

addS('Conduta', 'Se você decidir sair da SantaCreators, o procedimento correto é:', [
  'Remover o set sozinho',
  'Pedir saída direto pelo Discord',
  'Pedir demissão em game para a equipe remover corretamente',
  'Sair sem avisar para evitar demora'
], 2);

addS('Conduta', 'A frase “isso aqui não é só mais uma empresa de RP” quer dizer que a SantaCreators:', [
  'Tem menos regras que as outras',
  'Exige postura, consciência e responsabilidade',
  'Aceita qualquer tipo de conduta',
  'Funciona só na base da amizade'
], 1);

addS('Conduta', 'Ofensas preconceituosas disfarçadas de brincadeira são tratadas como:', [
  'Algo tolerável se for sem intenção',
  'Brincadeiras normais entre membros',
  'Conduta grave que não é tolerada',
  'Advertência leve apenas'
], 2);

// IMERSÃO / RP
addS('Imersão', 'Se seu Discord cair no meio do RP, o ideal é:', [
  'Falar no RP que o Discord caiu',
  'Usar uma justificativa imersiva',
  'Ignorar e voltar do nada',
  'Pedir para todos aguardarem fora do RP'
], 1);

addS('Imersão', 'Se você vir alguém bugado ou flutuando, a melhor conduta é:', [
  'Quebrar a cena e rir da situação',
  'Comentar no off na hora',
  'Improvisar algo criativo dentro da imersão',
  'Sair do local imediatamente'
], 2);

addS('Imersão', 'Deslogar na frente de outros players sem contexto é:', [
  'Aceitável se for rápido',
  'Uma quebra de imersão a ser evitada',
  'Normal dentro da cidade',
  'Permitido em qualquer situação'
], 1);

addS('Imersão', 'Trocar de roupa do nada na frente de outros players deve ser:', [
  'Feito normalmente se ninguém reclamar',
  'Evitado, buscando local discreto ou fechado',
  'Aceito somente perto da sede',
  'Usado como piada no RP'
], 1);

addS('Imersão', 'Qual expressão abaixo é mais imersiva?', [
  'Meu microfone parou',
  'Meu Discord bugou',
  'Minha garganta tá ruim',
  'Tô sem áudio no PC'
], 2);

addS('Imersão', 'A expressão “tô com os olhos abertos” substitui melhor:', [
  'Tô em live',
  'Tô sem áudio',
  'Tô lagado',
  'Tô sem teclado'
], 0);

addS('Imersão', 'Usar comandos do F8 para flutuar ou sentar no ar sem contexto é:', [
  'Uma forma criativa de RP',
  'Uma quebra desnecessária da realidade',
  'Permitido em qualquer ocasião',
  'Algo obrigatório em eventos'
], 1);

addS('Imersão', 'Quando algo técnico acontece, o ideal é:', [
  'Trazer o off direto para a cidade',
  'Improvisar e sustentar a narrativa',
  'Parar toda a cena para explicar',
  'Mandar todos aguardarem no Discord'
], 1);

// PRÉDIO / UNIFORME / GARAGENS
addS('Uniforme', 'Dentro do prédio da SantaCreators, é obrigatório usar:', [
  'Qualquer roupa escura',
  'Apenas um boné da empresa',
  'A jaqueta da SantaCreators',
  'Somente roupa social'
], 2);

addS('Uniforme', 'Se entrar no prédio sem a jaqueta, o correto é:', [
  'Continuar assim até alguém avisar',
  'Ir imediatamente a uma sala sozinho e vestir a jaqueta',
  'Sair correndo do prédio',
  'Mandar mensagem para a liderança'
], 1);

addS('Uniforme', 'Nas proximidades do prédio, o membro deve usar:', [
  'Ao menos uma peça da SantaCreators',
  'Somente a jaqueta oficial',
  'Uniforme completo sempre',
  'Apenas calça da empresa'
], 0);

addS('Uniforme', 'Para usar qualquer garagem da empresa, é necessário:', [
  'Ter cargo alto apenas',
  'Estar com uma peça do uniforme da SantaCreators',
  'Estar em call com a equipe',
  'Ter registro no painel no mesmo dia'
], 1);

addS('Uniforme', 'Em ações ilegais fora da sede, o uniforme deve ser:', [
  'Mantido para mostrar autoridade',
  'Usado só se estiver com aliados',
  'Retirado antes de sair para proteger a imagem da empresa',
  'Usado apenas à noite'
], 2);

addS('Uniforme', 'Nunca se deve trocar de roupa na frente de outros players porque isso:', [
  'Pode atrasar a ação',
  'Prejudica a coerência do RP',
  'Tira ponto do painel',
  'Impede uso da garagem'
], 1);

// VEÍCULOS
addS('Veículos', 'Usar veículos da SantaCreators em troca de tiro é:', [
  'Permitido com líder presente',
  'Proibido',
  'Aceitável só no norte',
  'Permitido se for rápido'
], 1);

addS('Veículos', 'Usar veículos da empresa em assalto de pista é:', [
  'Autorizado com organização',
  'Proibido',
  'Aceito fora do horário de evento',
  'Permitido sem uniforme'
], 1);

addS('Veículos', 'Sequestro com veículo da empresa só pode acontecer quando:', [
  'For um RP organizado, coerente e dentro do horário permitido',
  'Qualquer membro quiser usar',
  'Não houver veículos próprios',
  'For decidido no calor do momento'
], 0);

addS('Veículos', 'Se vir alguém usando veículo da empresa de forma errada, o correto é:', [
  'Se envolver na confusão',
  'Ignorar porque não é problema seu',
  'Gravar, reportar e não se envolver',
  'Tomar o veículo da pessoa'
], 2);

// BAÚS
addS('Baús', 'O baú pessoal é de uso:', [
  'Livre e exclusivo do membro',
  'Coletivo da equipe toda',
  'Apenas da coordenação',
  'Somente para eventos'
], 0);

addS('Baús', 'No baú geral, a regra principal é:', [
  'Pegar o máximo possível',
  'Usar com responsabilidade e apenas o necessário',
  'Retirar só com autorização da RESP',
  'Pegar apenas para vender'
], 1);

addS('Baús', 'No baú geral, vender, trocar ou distribuir itens livremente é:', [
  'Permitido entre aliados',
  'Aceito se repor depois',
  'Proibido',
  'Autorizado em evento'
], 2);

addS('Baús', 'Uma das limitações do baú geral é:', [
  '1 arma/item e 100 munições',
  '3 armas e munição livre',
  '2 armas e 300 munições',
  'Somente kits reparo'
], 0);

addS('Baús', 'O baú creators serve para:', [
  'Consumo dos membros',
  'Doações e entregas',
  'Uso exclusivo da coordenação',
  'Separar itens de eventos pessoais'
], 1);

addS('Baús', 'Retirar itens do baú creators é:', [
  'Permitido com aviso prévio',
  'Permitido para quem doou',
  'Proibido',
  'Liberado aos fins de semana'
], 2);

addS('Baús', 'No baú de vendas, a divisão correta é:', [
  '70% para você e 30% para o painel',
  '50% para você e 50% para o painel',
  '40% para você e 60% para o painel',
  '100% para o painel'
], 1);

addS('Baús', 'Se alguém pegar no baú de vendas e não dividir corretamente, a punição prevista é:', [
  'Advertência simples',
  'Perda temporária do baú',
  'Ban imediato',
  'Apenas devolução dos itens'
], 2);

addS('Baús', 'O baú coordenação é destinado para:', [
  'Organização interna de metas e entregas',
  'Uso livre de todos os membros',
  'Troca de itens entre equipes',
  'Guardar prêmios pessoais'
], 0);

addS('Baús', 'O baú responsável possui acesso:', [
  'Liberado para Coord+',
  'Restrito à RESP',
  'Disponível para Gestores',
  'Aberto a qualquer liderança'
], 1);

// PODERES / ADMINISTRAÇÃO
addS('Poderes', 'Os poderes da SantaCreators existem para:', [
  'Dar vantagem no RP',
  'Facilitar ações pessoais',
  'Fins administrativos e empresariais',
  'Ajudar amigos na cidade'
], 2);

addS('Poderes', 'A regra de ouro sobre poderes é:', [
  'Se um player comum não pode, você também não pode',
  'Você pode usar se ninguém ver',
  'Poder sempre vale acima do RP',
  'Responsável pode tudo'
], 0);

addS('Poderes', 'Usar F8 para ir até um amigo do outro lado da cidade é:', [
  'Ajuda operacional normal',
  'Abuso de poder',
  'Permitido em horários vazios',
  'Aceitável se não houver carro'
], 1);

addS('Poderes', 'Usar noclip sem necessidade para se locomover é:', [
  'Uma forma rápida de ajudar',
  'Aceitável fora de evento',
  'Abuso de poder',
  'Obrigatório para gestão'
], 2);

addS('Poderes', 'Se morrer em uma ação de RP, o correto é:', [
  'Usar /god para voltar',
  'Chamar médico ou ir para os bombeiros',
  'Levantar e seguir a ação',
  'Pedir para alguém usar poder'
], 1);

addS('Poderes', 'Se alguém cometer anti-rp contra você, o primeiro passo é:', [
  'Resolver na hora com comando',
  'Clipar tudo e pegar os passaportes',
  'Usar wall para acompanhar',
  'Punir a pessoa imediatamente'
], 1);

addS('Poderes', 'Sem alinhamento e sem autorização, comandos da gestão devem ser:', [
  'Usados com cautela',
  'Testados antes',
  'Não utilizados',
  'Aplicados só em amigos'
], 2);

addS('Poderes', 'Na dúvida sobre usar um poder, a melhor atitude é:', [
  'Usar e explicar depois',
  'Perguntar antes',
  'Deixar outro resolver sem avisar',
  'Testar em local vazio'
], 1);

addS('Poderes', 'Usar fix em benefício próprio ou de amigos, fora do contexto correto, é:', [
  'Permitido para Coord+',
  'Aceitável se não houver combate',
  'Proibido',
  'Permitido se for rápido'
], 2);

addS('Poderes', 'No treinamento de MKT Ticket, a regra de ouro dos botões é:', [
  'Clicar para aprender na prática',
  'Se não entende 100%, não clique',
  'Testar em qualquer canal',
  'Usar primeiro e perguntar depois'
], 1);

// CALL / ORGANIZAÇÃO / REGISTROS
addS('Organização', 'Ficar em call enquanto está na cidade é:', [
  'Obrigatório para todos',
  'Não obrigatório, mas recomendado para evolução',
  'Proibido em horários de evento',
  'Permitido só para liderança'
], 1);

addS('Organização', 'Responsáveis devem ficar em call porque:', [
  'É parte da obrigação deles ajudar e orientar',
  'Ganham mais pontos assim',
  'Sem call o bot não funciona',
  'É exigência só em domingo'
], 0);

addS('Organização', 'Os alinhamentos da SantaCreators devem ser feitos:', [
  'Por texto no Discord',
  'Por DM com qualquer membro',
  'Em call com o responsável',
  'Por e-mail interno'
], 2);

addS('Organização', 'Sempre que usar poderes, você deve:', [
  'Registrar no final do dia no canal correto',
  'Registrar apenas se alguém pedir',
  'Mandar por DM para a coordenação',
  'Anotar só se usar mais de uma vez'
], 0);

addS('Organização', 'O bate ponto funciona nos horários:', [
  '18:00 às 22:00 e 00:00 às 03:00',
  '17:00 às 23:00 e 01:00 às 04:00',
  '16:00 às 23:00 e 00:00 às 05:00',
  'Somente 19:00 às 23:00'
], 1);

addS('Organização', 'Hoje, um dos itens que gera pontos no sistema é:', [
  'Registro de poderes utilizados',
  'Estar online no Discord',
  'Mandar mensagem em call',
  'Usar uniforme na sede'
], 0);

addS('Organização', 'A frase “se não foi registrado, não aconteceu” reforça que:', [
  'O importante é só executar',
  'Registro é opcional se a liderança viu',
  'Tudo precisa ser documentado corretamente',
  'Basta avisar verbalmente depois'
], 2);

// ADVERTÊNCIA / PRESENÇA
addS('Advertência', 'Estar perto da sede sem nenhuma peça da empresa pode gerar:', [
  'Somente orientação verbal',
  'Advertência',
  'Nada, se estiver parado',
  'Aviso informal sem registro'
], 1);

addS('Advertência', 'Qual dessas frases representa quebra de imersão?', [
  'Vou meditar um cado',
  'Preciso mentalizar um portão abrindo',
  'Minha mãe tá me chamando',
  'Tive uma tontura forte'
], 2);

addS('Advertência', 'Flutuar sentado usando comando de F8 sem contexto é exemplo de:', [
  'Criatividade no RP',
  'Anti-RP',
  'Registro incorreto',
  'Conduta leve'
], 1);

addS('Advertência', 'Má conduta pode envolver:', [
  'Falta de respeito, deboche e rispidez',
  'Somente ausência em eventos',
  'Apenas erro de registro',
  'Só quebra de uniforme'
], 0);

addS('Advertência', 'Para Coord.+, Resp. Líder e Resp. Influ, os eventos das 19:00 são:', [
  'Facultativos',
  'Obrigatórios',
  'Opcionais com aviso depois',
  'Necessários apenas na sexta'
], 1);

addS('Advertência', 'Se não puder comparecer ao evento das 19:00, o correto é:', [
  'Avisar depois do evento',
  'Registrar ausência até 18:30 com justificativa',
  'Explicar na próxima call',
  'Mandar DM para qualquer membro'
], 1);

addS('Advertência', 'Falta sem presença e sem justificativa dentro do prazo gera:', [
  'ADV 1/3 e -5 pontos',
  'Somente advertência verbal',
  'Apenas perda de cargo',
  'Bloqueio de uniforme'
], 0);

addS('Advertência', 'Ao atingir 3/3 de ADV, ocorre:', [
  'Reset automático das advertências',
  'Suspensão de 24 horas apenas',
  'Reavaliação da permanência e da posição na equipe',
  'Troca imediata para Creator base'
], 2);

// HIERARQUIA / GI
addS('Hierarquia', 'A gestaoinfluencer é:', [
  'Um grupo separado da SantaCreators',
  'O núcleo interno da própria SantaCreators',
  'Uma equipe temporária externa',
  'Um sistema usado só em eventos'
], 1);

addS('Hierarquia', 'O acesso à gestaoinfluencer acontece:', [
  'Por formulário público',
  'Por pedido direto ao Owner',
  'Por convite baseado em evolução e confiança',
  'Por sorteio interno'
], 2);

addS('Hierarquia', 'No painel oficial da SantaCreators, o Nível 3 corresponde a:', [
  'Responsáveis',
  'Creator',
  'Gestão da equipe',
  'Coordenação'
], 1);

addS('Hierarquia', 'No Nível 2 ficam funções como:', [
  'Resp Influ e Resp Creators',
  'Equipe Creator e Junior',
  'Social Médias, Manager e Gestor',
  'Somente Coordenação'
], 2);

addS('Hierarquia', 'O Nível 1 da estrutura é formado por:', [
  'Os cargos responsáveis da liderança',
  'A base da operação',
  'Os iniciantes da equipe',
  'A equipe de eventos'
], 0);

addS('Hierarquia', 'O caminho normal até a gestaoinfluencer é:', [
  'Entrar e pedir cargo',
  'Ser conhecido fora da empresa',
  'Participar, evoluir e ser convidado',
  'Ter amizade com alguém da liderança'
], 2);

// SOCIAL MÉDIAS
addS('Social Médias', 'A função principal da Social Médias é:', [
  'Registrar líderes de org',
  'Organizar e estruturar os eventos da SantaCreators',
  'Aplicar punições internas',
  'Cuidar do baú geral'
], 1);

addS('Social Médias', 'Os eventos da SantaCreators acontecem:', [
  'De segunda a sábado',
  'Somente de terça a sexta',
  'Todos os dias da semana',
  'Apenas no fim de semana'
], 0);

addS('Social Médias', 'O horário padrão dos eventos é:', [
  '18:00',
  '20:00',
  '19:00',
  '21:00'
], 2);

addS('Social Médias', 'O cronograma da semana deve ser organizado em:', [
  'Segunda',
  'Domingo',
  'Quarta',
  'Sábado após o evento'
], 1);

addS('Social Médias', 'Na organização do cronograma, não pode repetir:', [
  'O mesmo evento na mesma cidade e no mesmo dia da semana anterior',
  'Nenhum evento já usado no mês',
  'Qualquer evento da mesma categoria',
  'Eventos em cidades diferentes'
], 0);

addS('Social Médias', 'A divulgação do evento deve ser feita:', [
  'Somente depois das 17:00',
  'Entre 00:00 e 17:00 do dia do evento',
  'Na semana anterior',
  'Apenas durante o evento'
], 1);

addS('Social Médias', 'Após o evento, a equipe deve registrar presença no canal de:', [
  'Cronograma',
  'Hall da fama',
  'Poderes em evento',
  'Convites líderes'
], 2);

addS('Social Médias', 'VIPs comerciais como Ouro e Platinum exigem autorização de:', [
  'Qualquer Gestor',
  'Macedo ou diretoria da cidade',
  'Somente Social Médias',
  'Apenas o vencedor do evento'
], 1);

// MANAGER
addS('Manager', 'A missão da equipe Manager Creators é:', [
  'Cuidar do ranking geral',
  'Garantir organizações presentes nos eventos',
  'Criar roupas de eventos',
  'Aprovar pagamentos de premiação'
], 1);

addS('Manager', 'Os eventos com maior contingente para atuação dos Managers costumam ser:', [
  'Quinta, sexta e sábado',
  'Segunda e terça',
  'Somente domingo',
  'Quarta e quinta apenas'
], 0);

addS('Manager', 'O prazo para registrar organizações vai de:', [
  'Segunda até sexta 18:00',
  'Domingo 00:00 até quinta 16:00',
  'Terça 00:00 até sábado 12:00',
  'Somente no dia do evento'
], 1);

addS('Manager', 'Para convidar uma organização, o contato deve ser feito com:', [
  'Qualquer membro da facção',
  'O líder ou representante oficial',
  'Somente com membros em call',
  'O primeiro que responder no Discord'
], 1);

addS('Manager', 'Registrar organização sem falar diretamente com o líder é:', [
  'Errado',
  'Aceitável se os membros confirmarem',
  'Permitido em evento grande',
  'Normal na ausência do líder'
], 0);

addS('Manager', 'Como Manager, você é staff?', [
  'Sim, sempre',
  'Não',
  'Apenas durante eventos',
  'Somente no Discord'
], 1);

addS('Manager', 'Convidar organização dentro do NC é:', [
  'Correto para agilizar',
  'Proibido',
  'Permitido se estiver sozinho',
  'Aceitável na garagem'
], 1);

addS('Manager', 'Cada organização registrada gera para o Manager:', [
  'Convite automático',
  'Apenas reconhecimento verbal',
  'Pontos no sistema',
  'Permissão temporária'
], 2);

// GESTOR
addS('Gestor', 'A principal missão do Gestor Creators é:', [
  'Aplicar punições',
  'Formar e orientar quem está começando',
  'Montar o cronograma semanal',
  'Controlar os baús'
], 1);

addS('Gestor', 'Para ser Gestor Creators, a pessoa deve ter vindo de:', [
  'Social Médias ou Manager Creators',
  'Resp Influ ou Resp Creators',
  'Equipe Creator apenas',
  'Qualquer área externa'
], 0);

addS('Gestor', 'O Gestor ensina principalmente membros que estão em fase:', [
  'Final da hierarquia',
  'Inicial da equipe',
  'Exclusiva de eventos',
  'De liderança máxima'
], 1);

addS('Gestor', 'Um feedback correto do Gestor deve ser:', [
  'Curto e genérico',
  'Detalhado, com qualidades, erros e evolução',
  'Apenas positivo',
  'Feito só por emoji'
], 1);

addS('Gestor', 'Sempre que ensinar algo a alguém da equipe, o Gestor deve:', [
  'Registrar o ensinamento',
  'Guardar para comentar no sábado',
  'Avisar apenas em call',
  'Esperar o membro pedir'
], 0);

addS('Gestor', 'Ao registrar alinhamento, deve ser informado:', [
  'O nome do Gestor apenas',
  'O ID Discord da pessoa alinhada',
  'O nome da cidade',
  'O horário da call somente'
], 1);

addS('Gestor', 'Ser Gestor substitui a função anterior da pessoa?', [
  'Sim, a antiga é removida',
  'Não, ela continua com a função de origem também',
  'Sim, mas só por um tempo',
  'Não, porém perde pontuação'
], 1);

// COORDENAÇÃO
addS('Coordenação', 'O Coord Creators é visto como:', [
  'Apoio secundário sem autonomia',
  'Braço direito da liderança e quem faz tudo funcionar',
  'Alguém focado só em eventos',
  'Um cargo exclusivo de registro'
], 1);

addS('Coordenação', 'O Coord precisa dominar:', [
  'Somente Social Médias',
  'Somente Manager',
  'Social, Manager e Gestor',
  'Apenas a parte financeira'
], 2);

addS('Coordenação', 'Se faltar alguém em uma área da equipe, o Coord deve:', [
  'Esperar a liderança resolver',
  'Assumir temporariamente para nada quebrar',
  'Cancelar a função do dia',
  'Ignorar se não for sua área favorita'
], 1);

addS('Coordenação', 'Além de executar funções, o Coord também deve:', [
  'Coordenar e acompanhar as equipes',
  'Focar só na própria pontuação',
  'Atuar apenas em call',
  'Registrar apenas presença'
], 0);

addS('Coordenação', 'O próximo passo natural de evolução do Coord Creators é:', [
  'Gestor',
  'Manager',
  'Resp Líder',
  'Equipe Creator'
], 2);

// RESPONSÁVEIS
addS('Responsáveis', 'O Resp Líder deve acompanhar principalmente se:', [
  'A coordenação e a equipe estão funcionando corretamente',
  'Só o hall da fama foi postado',
  'Apenas a própria call está cheia',
  'Somente o bate ponto da equipe'
], 0);

addS('Responsáveis', 'Se houver membro iniciante presente, o Resp Líder deve:', [
  'Fazer tudo sozinho para ganhar tempo',
  'Ensinar e orientar na hora',
  'Mandar o membro observar apenas',
  'Pedir para o iniciante sair da função'
], 1);

addS('Responsáveis', 'O Resp Influ possui autoridade para aplicar:', [
  'Somente alinhamentos',
  'Banimento do painel e do Discord com regra e evidência',
  'Apenas mudanças no uniforme',
  'Somente aprovação de cronograma'
], 1);

addS('Responsáveis', 'O Resp Creators é:', [
  'Um apoio temporário da equipe',
  'O responsável máximo pela operação da equipe Creators',
  'Um cargo exclusivo de eventos',
  'A base da gestão interna'
], 1);

addS('Responsáveis', 'Entre as responsabilidades do Resp Creators está:', [
  'Supervisionar decisões importantes e aprovar premiações',
  'Cuidar apenas do baú responsável',
  'Registrar orgs no lugar do Manager',
  'Fazer somente alinhamentos'
], 0);

return Q;
})();

globalThis.SC_QUIZ_BANK = globalThis.SC_QUIZ_BANK ?? SC_QUIZ_BANK;

const SC_RT_BANK = globalThis.SC_RT_BANK ?? SC_QUIZ_BANK;
globalThis.SC_RT_BANK = SC_RT_BANK;

console.log('[DEBUG] SC_RT_BANK SIZE:', SC_RT_BANK?.length);

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

function scq_isCurrentQuizMessage(messageId) {
  return !!messageId && SC_QUIZ_STATE.currentValidMessageId === messageId;
}

function scq_hasUserPlayedInRound(messageId, userId) {
  if (!messageId || !userId) return false;

  const uid = String(userId);
  const mid = String(messageId);

  // diário / quiz por reply
  if (SC_QUIZ_STATE.participantsByMsg?.[mid]?.[uid]) return true;

  // relâmpago
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

async function scq_resetEntireRanking(resetReason = 'manual_reset') {
  SC_QUIZ_STATE.leaderboard = {};
  SC_QUIZ_STATE.participantsByMsg = {};
  SC_QUIZ_STATE.activeQuizMessages = [];
  SC_QUIZ_STATE.weeklyParticipants = {};
  SC_QUIZ_STATE.currentValidMessageId = null;
  SC_QUIZ_STATE.currentSatisfied = true;

  SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
  SC_QUIZ_STATE.rt.active = null;
  SC_QUIZ_STATE.rt.attempts = {};

  scq_save();
  await scq_renderRankingSticky();

  await scq_log(scq_buildEmbed({
    title: '🧹 Ranking zerado',
    description: `O ranking do quiz foi zerado com sucesso.\nMotivo: **${resetReason}**`,
    color: 0xE67E22
  }));
}

function scq_trackCreatorsMessage(msg) {
  try {
    if (!msg?.id) return;
    SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds || [];

    if (!SC_QUIZ_STATE.creatorsCleanupMessageIds.includes(msg.id)) {
      SC_QUIZ_STATE.creatorsCleanupMessageIds.push(msg.id);
    }

    if (SC_QUIZ_STATE.creatorsCleanupMessageIds.length > 30) {
      SC_QUIZ_STATE.creatorsCleanupMessageIds = SC_QUIZ_STATE.creatorsCleanupMessageIds.slice(-30);
    }

    scq_save();
  } catch (e) {
    console.error('[SC_QUIZ] erro ao rastrear mensagem do creators:', e);
  }
}

async function scq_clearCreatorsTrackedMessages(channel) {
  try {
    const trackedIds = Array.isArray(SC_QUIZ_STATE.creatorsCleanupMessageIds)
      ? [...SC_QUIZ_STATE.creatorsCleanupMessageIds]
      : [];

    const idsToDelete = new Set(trackedIds);

    SC_QUIZ_STATE.creatorsCleanupMessageIds = [];
    scq_save();

    // 1) tenta apagar tudo que já foi rastreado
    for (const id of trackedIds) {
      try {
        const msg = await channel.messages.fetch(id).catch(() => null);
        if (msg) await msg.delete().catch(() => {});
      } catch (_) {}
    }

    // 2) fallback: procura mensagens antigas do próprio bot que sejam do quiz
    const recent = await channel.messages.fetch({ limit: 100 }).catch(() => null);
    if (!recent) return;

    const shouldDeleteQuizMessage = (msg) => {
      if (!msg || msg.author?.id !== client.user?.id) return false;
      if (idsToDelete.has(msg.id)) return false;

      const embed = Array.isArray(msg.embeds) && msg.embeds.length ? msg.embeds[0] : null;
      const title = String(embed?.title || '').trim();
      const footer = String(embed?.footer?.text || '').trim();
      const desc = String(embed?.description || '').trim();
      const content = String(msg.content || '').trim();

      const text = [title, footer, desc, content].join(' \n ').toLowerCase();

      return (
        text.includes('quiz diário') ||
        text.includes('pergunta relâmpago') ||
        text.includes('quiz relâmpago') ||
        text.includes('relâmpago encerrado') ||
        text.includes('parabéns! resposta correta') ||
        text.includes('resposta incorreta') ||
        text.includes('modo relâmpago') ||
        text.includes('responda por reply nesta mensagem') ||
        text.includes('vale pontos internos') ||
        text.includes('vale ponto para o primeiro')
      );
    };

    for (const msg of recent.values()) {
      try {
        if (shouldDeleteQuizMessage(msg)) {
          await msg.delete().catch(() => {});
        }
      } catch (_) {}
    }
  } catch (e) {
    console.error('[SC_QUIZ] erro ao limpar mensagens antigas do creators:', e);
  }
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

    // invalida também o histórico lógico do diário
    SC_QUIZ_STATE.activeQuizMessages = [];
    SC_QUIZ_STATE.participantsByMsg = {};

    // invalida qualquer quiz atual
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
       // ✅ Função global: posta o QUIZ DIÁRIO no canal Creators
async function scq_postDailyQuiz(override = false) {
  if (!override && scq_hasActiveQuiz()) {
    console.log("[SC_QUIZ] Já tem um quiz ativo, não vou postar outro.");
    return;
  }
  if (override) scq_cancelAllActive('daily_override');

  const channel = await client.channels.fetch(SC_QUIZ_CREATORS_CHANNEL_ID).catch(() => null);
  if (!channel) return;

  await scq_clearCreatorsTrackedMessages(channel);

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

  scq_trackCreatorsMessage(msg);

  // limpa qualquer diária anterior da memória lógica
  SC_QUIZ_STATE.activeQuizMessages = [];
  SC_QUIZ_STATE.participantsByMsg = {};

  // marca como “válido” e bloqueia novos até interação
  SC_QUIZ_STATE.currentValidMessageId = msg.id;
  SC_QUIZ_STATE.currentSatisfied = false;

  // mantém SOMENTE a diária atual
  SC_QUIZ_STATE.participantsByMsg[msg.id] = {};
  SC_QUIZ_STATE.activeQuizMessages.push({ id: msg.id, qid: q.id, createdAt: Date.now() });

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
  if (!Array.isArray(SC_RT_BANK) || SC_RT_BANK.length === 0) {
    console.error('[SC_RT] ERRO: banco de perguntas vazio ou inválido');
    return null;
  }
  return SC_RT_BANK[Math.floor(Math.random()*SC_RT_BANK.length)];
}
// 🔧 Helper único para iniciar uma rodada de relâmpago (fora de qualquer função)
async function sc_rt_beginRound(channel, embed, q, { announceOnTimeout = false } = {}) {
  await scq_clearCreatorsTrackedMessages(channel);

  const msg = await channel.send({
    content: `<@&${SC_MENTION_ROLES[0]}> <@&${SC_MENTION_ROLES[1]}>`,
    embeds: [embed],
    allowedMentions: { roles: SC_MENTION_ROLES }
  });

  scq_trackCreatorsMessage(msg);

  // garante a estrutura no estado
  SC_QUIZ_STATE.rt = SC_QUIZ_STATE.rt || {};
  SC_QUIZ_STATE.rt.attempts = SC_QUIZ_STATE.rt.attempts || {};

  // limpa qualquer diária antiga da memória lógica
  SC_QUIZ_STATE.activeQuizMessages = [];
  SC_QUIZ_STATE.participantsByMsg = {};

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

        scq_trackCreatorsMessage(timeoutMsg);
      }

      await scq_log(scq_buildEmbed({
        title: '⏰ Relâmpago encerrado',
        description: `Sem vencedor | qid=${q.id} | gabarito **${q.resposta}**`
      }));
    } catch {}
  }, SC_RT_ACTIVE_TIMEOUT_MS);
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
if (!q) {
  console.error('[SC_RT] Nenhuma pergunta encontrada para relâmpago');
  return;
}

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

  // trava principal: só o relâmpago oficial atual pode ser respondido
  if (!scq_isCurrentQuizMessage(act.messageId)) return;

  // se for reply, ele PRECISA apontar para a mensagem oficial atual
  if (message.reference?.messageId && message.reference.messageId !== act.messageId) return;

  const q = SC_RT_BANK.find(x => x.id === act.qid);
  const ans = scq_pickAnswerLetter(message.content, q);
  if (!ans) return;

  // liberar próximos: houve interação válida no quiz oficial atual
  SC_QUIZ_STATE.currentSatisfied = true;

  // Apaga pra evitar cola
  message.delete().catch(()=>{});

  // 1 tentativa por usuário por relâmpago
  const msgId = act.messageId;

  if (scq_hasUserPlayedInRound(msgId, message.author.id)) {
    await message.channel.send({
      content: `<@${message.author.id}>`,
      embeds: [scq_buildEmbed({
        title: '⛔ Você já participou desta rodada',
        description: 'Você já respondeu este quiz relâmpago. Aguarde a próxima rodada para tentar de novo.',
        image: GIF_QUIIZ_URL,
        color: 0xF39C12
      })],
      allowedMentions: { users: [message.author.id] }
    }).then((m) => {
      setTimeout(() => m.delete().catch(() => {}), 8000);
    }).catch(() => {});
    return;
  }

  scq_markUserPlayedInRound(msgId, message.author.id, 'fast');
  scq_save();

  const acertou = (ans === act.correct);

  if (!acertou) {
    scq_updateLeaderboard(message.author.id, 0, 1);
    const wrongMsg = await message.channel.send({
      content: `<@${message.author.id}>`,
      embeds: [scq_buildEmbed({
        title: '❌ Resposta incorreta',
        description: 'Não foi dessa vez! Continue tentando nos próximos relâmpagos. 💪',
        image: GIF_QUIIZ_URL,
        color: 0xE74C3C
      })],
      allowedMentions: { users: [message.author.id] }
    });

    scq_trackCreatorsMessage(wrongMsg);
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

  const winnerMsg = await message.channel.send({
    content: `<@${message.author.id}>`,
    embeds: [scq_buildEmbed({
      title: '🏁 Parabéns! Resposta correta',
      description: `Você marcou **+${SC_QUIZ_POINTS_RIGHT}** no ranking! Gabarito: **${act.correct}**`,
      image: GIF_QUIIZ_URL,
      color: 0x2ECC71
    })],
    allowedMentions: { users: [message.author.id] }
  });

  scq_trackCreatorsMessage(winnerMsg);

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

    const currentId = SC_QUIZ_STATE.currentValidMessageId || null;
    if (!currentId) return;

    const active = SC_QUIZ_STATE.activeQuizMessages.find(x => x.id === currentId);
    if (!active) return;

    const replyTo = message.reference?.messageId || null;

    // Se for reply, precisa apontar para a mensagem oficial atual
    if (replyTo && replyTo !== currentId) return;

    // Se NÃO for reply, só aceita se for letra única A/B/C/D
    if (!replyTo && !scq_isSingleLetter(message.content)) return;

    // trava principal: só responde ao quiz oficial atual
    if (!scq_isCurrentQuizMessage(currentId)) return;

    const quizUser = message.author;

    // carregar pergunta e extrair resposta válida
    const qMain = SC_QUIZ_BANK.find(x => x.id === active.qid);
    if (!qMain) return;

    const ans = scq_pickAnswerLetter(message.content, qMain);
    if (!ans) return; // não é letra nem texto exato → ignora sem apagar/contar

    // trava de 1 participação por usuário neste quiz diário
    if (scq_hasUserPlayedInRound(currentId, quizUser.id)) {
      message.delete().catch(() => {});

      await message.channel.send({
        content: `<@${quizUser.id}>`,
        embeds: [scq_buildEmbed({
          title: '⛔ Você já participou deste quiz',
          description: 'Você já participou desse quiz. Aguarde a próxima partida para tentar novamente.',
          image: GIF_QUIIZ_URL,
          color: 0xF39C12
        })],
        allowedMentions: { users: [quizUser.id] }
      }).then((m) => {
        setTimeout(() => m.delete().catch(() => {}), 8000);
      }).catch(() => {});

      return;
    }

    // apagar do chat só depois de validar
    message.delete().catch(() => {});

    // liberar próximos: houve interação válida no quiz oficial atual
    SC_QUIZ_STATE.currentSatisfied = true;

    // marca participação
    scq_markUserPlayedInRound(currentId, quizUser.id, 'daily');
    scq_save();

    const right = (ans === qMain.resposta);
    scq_updateLeaderboard(
      quizUser.id,
      right ? SC_QUIZ_POINTS_RIGHT : 0,
      right ? 0 : 1
    );

    // logs + feedback público
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

    const dailyResultMsg = await message.channel.send({
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

scq_trackCreatorsMessage(dailyResultMsg);

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
    // se apagaram a mensagem “válida”, libera novos
    if (SC_QUIZ_STATE.currentValidMessageId === msg.id) {
  // não libera a fila no delete; mantém bloqueado
  // (comenta/retira as linhas abaixo)
  // SC_QUIZ_STATE.currentValidMessageId = null;
  // SC_QUIZ_STATE.currentSatisfied = true;
  scq_save();
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

  const currentId = SC_QUIZ_STATE.currentValidMessageId || null;
  if (!currentId) return;

  const fastAct = SC_QUIZ_STATE.rt?.active || null;
  const isCurrentFast = !!fastAct && fastAct.messageId === currentId;
  const isCurrentDaily = !!SC_QUIZ_STATE.activeQuizMessages?.some(x => x.id === currentId);

  if (isCurrentFast) {
    await sc_rt_handlePotentialAnswer(message);
    return;
  }

  if (isCurrentDaily) {
    await scq_handleDailyAnswer(message);
    return;
  }

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
      await sc_rt_postFastQuiz(true); // força novo relâmpago
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
      await scq_postDailyQuiz(true);  // força novo quiz diário
      await message.react('✅').catch(()=>{});
      return;
    }

  } catch (e) {
    console.error("[SC_QUIZ] erro no messageCreate:", e);
  }
});

console.log("teste deploy square");

//teste
  } catch (err) {
    console.error("[SC_QUIZ] Falha geral:", err);
  }
})();
