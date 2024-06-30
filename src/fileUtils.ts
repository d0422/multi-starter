import { readFile, readdir } from 'fs';
import path from 'path';
import { CommandObject } from './type';

export const getAllDirectoryInCurrentPath = async (currentPath: string) => {
  return await new Promise<string[]>((resolve, reject) =>
    readdir(currentPath, { withFileTypes: true }, (err, files) => {
      resolve(
        files.filter((file) => file.isDirectory()).map((file) => file.name)
      );
      if (err) reject();
    })
  );
};

export const findPackageJson = async (pathString: string) => {
  return await new Promise((resolve, reject) => {
    readdir(path.resolve(pathString), (err, files) => {
      if (err) reject();
      resolve(files.find((file) => file === 'package.json'));
    });
  });
};

export const getExecutableDirectories = async (allDirectories: string[]) => {
  const result = [];
  for (const directory of allDirectories) {
    const isExecutable = await findPackageJson(directory);

    isExecutable && result.push(directory);
  }

  return result;
};

export const findCommand = async (packageJsonPath: string, command: string) => {
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
