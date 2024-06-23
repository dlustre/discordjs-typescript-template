import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandConfig {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

export const createCommand = (commandConfig: CommandConfig) => commandConfig;
