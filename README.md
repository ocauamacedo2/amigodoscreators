# Discord Bot - Safe Base (Square Cloud ready)

Files included:
- index.js        : main bot file
- package.json    : dependencies and start script
- .env.example    : environment variables template
- README.md       : this file

How to use:
1. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN` with your bot token.
2. Install dependencies locally (optional): `npm install`
3. Start with `npm start` or deploy to Square Cloud using your usual workflow.

Commands (in any server where the bot is present):
- `!ping`  -> bot replies with Pong and latency
- `!uptime` -> bot replies with process uptime in seconds

Notes:
- This bot is intentionally simple and avoids forced voice presence.
- If you want voice features (music, streaming), ask and I'll help implement a compliant solution.
