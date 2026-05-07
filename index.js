const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Web server running on port", PORT);
});

const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const UNIVERSE_ID = "10051576955";

const SELF_URL = process.env.SELF_URL;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let lastVisits = null;

async function updateVisits() {
  try {
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`);
    const data = await res.json();

    const visits = data.data?.[0]?.visits || 0;

    if (visits === lastVisits) return;
    lastVisits = visits;

    const formatted = visits.toLocaleString("en");

    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.setName(`〔🍪〕Visits: ${formatted}`);

    console.log("Updated:", formatted);
  } catch (err) {
    console.error("Error:", err);
  }
}

function startSelfPing() {
  if (!SELF_URL) return;

  setInterval(async () => {
    try {
      await fetch(SELF_URL);
      console.log("Self ping successful");
    } catch (err) {
      console.error("Self ping failed:", err);
    }
  }, 5 * 60 * 1000);
}

client.once("clientReady", () => {
  console.log("Bot is online!");

  updateVisits();
  setInterval(updateVisits, 10 * 60 * 1000);

  startSelfPing();
});

client.login(TOKEN);
