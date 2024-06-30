import { select } from '@inquirer/prompts';
import chalk from 'chalk';

const COMMAND_SET = ['install', 'start', 'dev'];

export const getChoosedCommand = async () => {
  try {
    return await select({
      message: 'Choose script command : ',
      choices: COMMAND_SET.map((command) => ({
        name: command,
        value: command,
      })),
    });
  } catch (err) {
    console.error(chalk.blue('The operation has been cancelled.'));
  }
};
