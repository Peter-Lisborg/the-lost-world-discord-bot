const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const UNIVERSE_ID = "10051576955";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function updateVisits() {
  try {
    const res = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
    );
    const data = await res.json();

    const visits = data.data[0].visits || 0;
    const formatted = visits.toLocaleString("en");

    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.setName(`〔🍪〕Visits: ${formatted}`);

    console.log("Updated:", formatted);
  } catch (err) {
    console.error("Error:", err);
  }
}

client.once("ready", () => {
  console.log("Bot is online!");

  updateVisits();
  setInterval(updateVisits, 10 * 60 * 1000);
});

client.login(TOKEN);
