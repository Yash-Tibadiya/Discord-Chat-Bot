const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const OpenAI = require("openai");

const TOKEN = process.env.TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if (message.content === "Hello") {
    message.reply("Hello 👋");
  } else if (message.content === "peace") {
    message.reply(
      "Those who do not understand true pain can never understand true peace."
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "ping") {
      interaction.reply("Pong!");
    } else if (interaction.commandName === "chat") {
      const prompt = interaction.options.getString("prompt");
      await interaction.deferReply(); // Acknowledge the interaction
      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-4o",
          store: true,
        });
        await interaction.editReply(
          completion.choices[0].message.content.trim()
        );
      } catch (error) {
        console.error(error);
        await interaction.editReply("Sorry, I couldn't process your request.");
      }
    }
  }
});

client.login(TOKEN);
