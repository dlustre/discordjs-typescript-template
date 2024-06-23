import { Collection, REST, Routes } from "discord.js";
import { readdir } from "fs/promises";
import { env } from "./env.ts";
import { CommandConfig } from "./command.ts";

/** Deploys all commands to all permitted guilds. Returns the collection of deployed commands. */
export async function deployGlobalCommands() {
  const commandFiles = (await readdir("src/commands")).filter((file) =>
    file.endsWith(".ts")
  );

  console.log(`Commands to deploy: ${commandFiles.toString()}`);

  const commands: CommandConfig[] = await Promise.all(
    commandFiles.map(
      async (file) => (await import(`~/commands/${file}`)).default
    )
  );

  const rest = new REST().setToken(env.TOKEN);

  try {
    console.log(`Started reloading ${commands.length} application commands.`);

    await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
      body: commands.map((command) => command.data.toJSON()),
    });

    console.log(
      `Successfully reloaded ${commands.length} application commands.`
    );

    return new Collection<string, CommandConfig>(
      commands.map((command) => [command.data.name, command])
    );
  } catch (error) {
    console.error(`Error reloading application commands:`, error);
    throw error;
  }
}
