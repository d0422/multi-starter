import { spawn } from 'child_process';
import { CommandObject } from './type';

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
      console.error(`Error executing command in ${path}:`, err);
    });

    child.on('close', (code) => {
      console.log(`Command executed in ${path} exited with code ${code}`);
    });
  } else {
    console.error(`Command not found in ${path}`);
  }
};
