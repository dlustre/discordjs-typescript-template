import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "~/utils/env.ts";

import { deployGlobalCommands } from "~/utils/deployGlobalCommands.ts";

const client = Object.assign(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
  {
    commands: await deployGlobalCommands(),
  }
);

client.once(Events.ClientReady, (readyClient) =>
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred)
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    else
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
  }
});

client.login(env.TOKEN);
