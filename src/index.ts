#!/usr/bin/env node
import path from 'path';
import { readdir } from 'fs';

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

const run = async () => {
  const directories = await getAllDirectory();
  const pakcageJsonList = await Promise.all(
    directories.filter(async (directory) => {
      const packageJson = await findPackageJson(directory);
      return packageJson;
    })
  );
  console.log(pakcageJsonList);
};

run();
