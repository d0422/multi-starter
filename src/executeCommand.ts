import { spawn } from 'child_process';
import { CommandObject } from './type';
import chalk from 'chalk';

export const executeCommand = (
  { executable, path, packageManager }: CommandObject,
  command: string
) => {
  if (executable) {
    const args = command === 'install' ? ['install'] : ['run', command];

    const child = spawn(packageManager, args, {
      cwd: path,
      stdio: 'inherit',
      shell: process.platform === 'win32' ? true : false,
    });

    child.on('error', (err) => {
      console.error(chalk.red(`Error executing command in ${path}: ${err}`));
    });

    child.on('close', (code) => {
      console.log(
        chalk.blue(`Command executed in ${path} exited with code ${code}`)
      );
    });
  } else {
    console.error(chalk.red(`Command not found in ${path}`));
  }
};
