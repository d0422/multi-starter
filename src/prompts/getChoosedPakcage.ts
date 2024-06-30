import { checkbox } from '@inquirer/prompts';

export const getChoosedPackage = async (packageJsonList: string[]) => {
  return await checkbox({
    message: 'Choose packages you want to run',
    choices: packageJsonList.map((packageJson) => ({
      name: packageJson,
      value: packageJson,
    })),
  });
};
