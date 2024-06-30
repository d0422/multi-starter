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

const currentPath = process.cwd();

const run = async () => {
  const allDirectories = await getAllDirectoryInCurrentPath(currentPath);
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
