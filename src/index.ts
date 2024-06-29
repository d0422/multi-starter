#!/usr/bin/env node
import path from 'path';
import { readFile, readdir } from 'fs';

const currentPath = process.cwd();

const getAllDirectory = async () => {
  return await new Promise<string[]>((resolve, reject) =>
    readdir(currentPath, { withFileTypes: true }, (err, files) => {
      resolve(
        files
          .filter((file) => file.isDirectory())
          .map((file) => `${file.parentPath}/${file.name}`)
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

const findCommand = async (packageJsonPath: string) => {
  return new Promise((resolve, reject) => {
    readFile(`${packageJsonPath}/package.json`, 'utf-8', (err, data) => {
      if (err) reject(`Cannot find package.json in ${packageJsonPath}`);

      const parsedJson = JSON.parse(data);
      resolve({
        path: packageJsonPath,
        command: parsedJson['scripts']['start'],
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
  const pakcageJsonList = await getExecutableDirectories(allDirectories);
  const commandObject = await Promise.all(
    pakcageJsonList.map(async (packageJson) => await findCommand(packageJson))
  );
  console.log(commandObject);
};

run();
