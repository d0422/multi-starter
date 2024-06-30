import { checkbox } from '@inquirer/prompts';
import { ExecutableDirectory } from '../type';

export const getChoosedPackage = async (
  packageJsonList: ExecutableDirectory[]
) => {
  return await checkbox({
    message: 'Choose packages you want to run',
    choices: packageJsonList.map((packageJson) => ({
      name: `${packageJson.path} (${packageJson.packageManager})`,
      value: packageJson,
    })),
  });
};
