// ===================================================================
// 🧩 TOPO PADRONIZADO (COMPATÍVEL COM MÓDULOS DO BOT PRINCIPAL)
// ===================================================================

// ---- Variáveis de ambiente ----
import { setupQuiz } from './quiz.js';
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
