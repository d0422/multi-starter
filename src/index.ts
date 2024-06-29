#!/usr/bin/env node
import path, { parse } from 'path';
import { readFile, readdir } from 'fs';
import { getChoosedPackage } from './prompts/getChoosedPakcage.js';
import { getChoosedCommand } from './prompts/getChoosedCommand.js';
import { spawn } from 'child_process';

const currentPath = process.cwd();

export interface ChoosePackage {
  package: string[];
}

interface CommandObject {
  path: string;
  executable: boolean;
}

const getAllDirectory = async () => {
  return await new Promise<string[]>((resolve, reject) =>
    readdir(currentPath, { withFileTypes: true }, (err, files) => {
      resolve(
        files.filter((file) => file.isDirectory()).map((file) => file.name)
      );
      if (err) reject();
    })
  );
};

const findPackageJson = async (pathString: string) => {
  return await new Promise((resolve, reject) => {
    readdir(path.resolve(pathString), (err, files) => {
      if (err) reject();
      resolve(files.find((file) => file === 'package.json'));
    });
  });
};

const findCommand = async (packageJsonPath: string, command: string) => {
  return new Promise<CommandObject>((resolve, reject) => {
    readFile(`${packageJsonPath}/package.json`, 'utf-8', (err, data) => {
      if (err) reject(`Cannot find package.json in ${packageJsonPath}`);
      const parsedJson = JSON.parse(data);
      const executable =
        command === 'install' ? true : !!parsedJson['scripts'][command];
      resolve({
        path: packageJsonPath,
        executable,
      });
    });
  });
};

const getExecutableDirectories = async (allDirectories: string[]) => {
  const result = [];
  for (const directory of allDirectories) {
    const isExecutable = await findPackageJson(directory);

    isExecutable && result.push(directory);
  }

  return result;
};

const run = async () => {
  const allDirectories = await getAllDirectory();
  const packageJsonList = await getExecutableDirectories(allDirectories);

  const choosedPackage = await getChoosedPackage(packageJsonList);
  const answer = await getChoosedCommand();

  const commandObjects = await Promise.all(
    choosedPackage['package']
      .map((packageJson) => path.resolve(currentPath, packageJson))
      .map(
        async (packageJson) => await findCommand(packageJson, answer['command'])
      )
  );
  commandObjects.forEach(({ path, executable }) => {
    if (executable) {
      const args =
        answer.command === 'install' ? ['install'] : ['run', answer.command];

      const child = spawn('npm', args, {
        cwd: path,
        stdio: 'inherit',
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
  });
};

run();
