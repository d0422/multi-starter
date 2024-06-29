import inquirer from 'inquirer';

export const getChoosedCommand = async () => {
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Choose script command : ',
      choices: ['install', 'start', 'dev'],
    },
  ]);
};
