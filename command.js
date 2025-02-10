const { REST, Routes } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  {
    name: "chat",
    description: "Ask anything to OpenAI",
    options: [
      {
        type: 3, // STRING type
        name: "prompt",
        description: "The prompt to get an answer",
        required: true,
      },
    ],
  },
  {
    name: "imagine",
    description: "Generate an image using OpenAI",
    options: [
      {
        type: 3, // STRING type
        name: "prompt",
        description: "The prompt to generate an image",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
