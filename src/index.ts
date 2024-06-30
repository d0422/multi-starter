#!/usr/bin/env node
import path from 'path';
import { readFile, readdir } from 'fs';
import { getChoosedPackage } from './prompts/getChoosedPakcage.js';
import { getChoosedCommand } from './prompts/getChoosedCommand.js';
import { spawn } from 'child_process';
import { executeCommand } from './executeCommand.js';
import { CommandObject } from './type.js';

const currentPath = process.cwd();

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
    choosedPackage
      .map((packageJson) => path.resolve(currentPath, packageJson))
      .map(async (packageJson) => await findCommand(packageJson, answer))
  );
  commandObjects.forEach((commandObject) =>
    executeCommand(commandObject, answer)
  );
};

run();
