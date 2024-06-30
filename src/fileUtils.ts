import { readFile, readdir } from 'fs';
import path from 'path';
import { CommandObject, ExecutableDirectory, PackageManager } from './type';

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

export const getPackageManager = async (pathString: string) => {
  return await new Promise<PackageManager | undefined>((resolve, reject) => {
    readdir(path.resolve(pathString), (err, files) => {
      if (err) reject();
      const isYarn = files.find((file) => file === 'yarn.lock');
      const isPnpm = files.find((file) => file === 'pnpm-lock.yaml');
      const isPackage = files.find((file) => file === 'package.json');
      if (isYarn && isPackage) resolve('yarn');
      if (isPnpm && isPackage) resolve('pnpm');
      if (isPackage) resolve('npm');
      resolve(undefined);
    });
  });
};

export const getExecutableDirectories = async (
  allDirectories: string[]
): Promise<ExecutableDirectory[]> => {
  const result = [];
  for (const directory of allDirectories) {
    const packageManager = await getPackageManager(directory);

    packageManager &&
      result.push({ path: directory, packageManager: packageManager });
  }

  return result;
};

export const findCommand = async (
  executableDirectory: ExecutableDirectory,
  command: string
) => {
  return new Promise<CommandObject>((resolve, reject) => {
    readFile(
      `${executableDirectory.path}/package.json`,
      'utf-8',
      (err, data) => {
        if (err)
          reject(`Cannot find package.json in ${executableDirectory.path}`);
        const parsedJson = JSON.parse(data);
        const executable =
          command === 'install' ? true : !!parsedJson['scripts'][command];
        resolve({
          path: executableDirectory.path,
          packageManager: executableDirectory.packageManager,
          executable,
        });
      }
    );
  });
};
