const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const OpenAI = require("openai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
        const replyContent = completion.choices[0].message.content.trim();
        if (replyContent.length > 2000) {
          const parts = replyContent.match(/[\s\S]{1,2000}/g); // Split into chunks of 2000 characters
          for (const part of parts) {
            await interaction.followUp(part);
          }
        } else {
          await interaction.editReply(replyContent);
        }
      } catch (error) {
        console.error(error);
        await interaction.editReply("Sorry, I couldn't process your request.");
      }
    } else if (interaction.commandName === "imagine") {
      const prompt = interaction.options.getString("prompt");
      await interaction.deferReply(); // Acknowledge the interaction
      try {
        const image = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
        });

        const imageUrl = image.data[0].url;
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "binary");
        const filePath = path.join(__dirname, "image.png");

        fs.writeFileSync(filePath, buffer);

        await interaction.editReply({ files: [filePath] });
      } catch (error) {
        console.error(error);
        await interaction.editReply("Sorry, I couldn't generate the image.");
      }
    }
  }
});

client.login(TOKEN);
