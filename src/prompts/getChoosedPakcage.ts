import { checkbox } from '@inquirer/prompts';
import { ExecutableDirectory } from '../type';
import chalk from 'chalk';

export const getChoosedPackage = async (
  packageJsonList: ExecutableDirectory[]
) => {
  try {
    return await checkbox({
      message: 'Choose packages you want to run',
      choices: packageJsonList.map((packageJson) => ({
        name: `${packageJson.path} (${chalk.green(
          packageJson.packageManager
        )})`,
        value: packageJson,
      })),
    });
  } catch (err) {
    console.error(chalk.blue('The operation has been cancelled.'));
  }
};
