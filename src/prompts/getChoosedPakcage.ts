import { ChoosePackage } from '../index.js';
import inquirer from 'inquirer';

export const getChoosedPackage = async (packageJsonList: string[]) => {
  return await inquirer.prompt<ChoosePackage>([
    {
      type: 'checkbox',
      name: 'package',
      message: 'Choose packages you want to run',
      choices: packageJsonList,
    },
  ]);
};
