import { spawn } from 'child_process';
import { CommandObject } from './type';
import chalk from 'chalk';
import { Command } from './prompts/getChoosedCommand';

export const runCommand = (
  { executable, path, packageManager }: CommandObject,
  command: Command
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

export const executeMultipleCommand = (
  { executable, path, packageManager }: CommandObject,
  command: Command
) => {
  const child = spawn(packageManager, ['install'], {
    cwd: path,
    stdio: 'inherit',
    shell: process.platform === 'win32' ? true : false,
  });

  child.on('exit', () => {
    if (command === 'install + dev')
      return runCommand({ executable, path, packageManager }, 'dev');
    return runCommand({ executable, path, packageManager }, 'start');
  });
};

export const executeCommand = (
  { executable, path, packageManager }: CommandObject,
  command: Command
) => {
  if (!executable)
    return console.error(chalk.red(`Command not found in ${path}`));

  if (command === 'install + dev' || command == 'install + start') {
    return executeMultipleCommand(
      { executable, path, packageManager },
      command
    );
  }

  return runCommand({ executable, path, packageManager }, command);
};
