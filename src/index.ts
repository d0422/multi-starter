#!/usr/bin/env node
import path from 'path';
import { getChoosedPackage } from './prompts/getChoosedPakcage.js';
import { getChoosedCommand } from './prompts/getChoosedCommand.js';
import { executeCommand } from './executeCommand.js';
import {
  findCommand,
  getAllDirectoryInCurrentPath,
  getExecutableDirectories,
} from './fileUtils.js';
import chalk from 'chalk';

const currentPath = process.cwd();

const run = async () => {
  const allDirectories = await getAllDirectoryInCurrentPath(currentPath);
  const packageJsonList = await getExecutableDirectories(allDirectories);

  if (packageJsonList.length === 0) {
    console.error(chalk.red('There is no executable package directory'));
    return;
  }

  const choosedPackage = await getChoosedPackage(packageJsonList);
  if (!choosedPackage) return;

  const answer = await getChoosedCommand();
  if (!answer) return;

  const commandObjects = await Promise.all(
    choosedPackage
      .map((packageJson) => ({
        path: path.resolve(currentPath, packageJson.path),
        packageManager: packageJson.packageManager,
      }))
      .map(async (packageJson) => await findCommand(packageJson, answer))
  );
  commandObjects.forEach((commandObject) =>
    executeCommand(commandObject, answer)
  );
};

run();
