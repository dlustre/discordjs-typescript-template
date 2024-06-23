import { SlashCommandBuilder } from "discord.js";
import { createCommand } from "../command.ts";

export default createCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  },
});