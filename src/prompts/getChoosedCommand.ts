import { select } from '@inquirer/prompts';

const COMMAND_SET = ['install', 'start', 'dev'];

export const getChoosedCommand = async () => {
  return await select({
    message: 'Choose script command : ',
    choices: COMMAND_SET.map((command) => ({
      name: command,
      value: command,
    })),
  });
};
