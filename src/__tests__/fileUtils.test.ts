import {
  getPackageManager,
  getAllDirectoryInCurrentPath,
  getExecutableDirectories,
} from '../fileUtils';
import { Dirent, readdir } from 'fs';
import * as FileUtilsModule from '../fileUtils';

jest.mock('fs');
const mockedReaddir = readdir as jest.MockedFunction<typeof readdir>;

describe('getAllDirectoryInCurrentPath', () => {
  it('should resolve with an array of directory names', async () => {
    const mockFiles = [
      { isDirectory: () => true, name: 'dir1' },
      { isDirectory: () => false, name: 'file1.txt' },
      { isDirectory: () => true, name: 'dir2' },
      { isDirectory: () => true, name: 'dir3' },
    ] as Dirent[];

    mockedReaddir.mockImplementationOnce((path, options, callback) => {
      callback(null, mockFiles);
    });

    const result = await getAllDirectoryInCurrentPath('somePath');

    expect(result).toEqual(['dir1', 'dir2', 'dir3']);
    expect(mockedReaddir).toHaveBeenCalledTimes(1);
  });
});

describe('getPackageManager', () => {
  it('shoud resolve "yarn" when package.json and yarn.lock have been founded', async () => {
    const mockFiles = ['package.json', 'someFile.ts', 'yarn.lock'];

    mockedReaddir.mockImplementationOnce((path, callback: any) => {
      callback(null, mockFiles);
    });
    const result = await getPackageManager('somePath');
    expect(result).toBe('yarn');
  });

  it('shoud resolve "pnpm" when package.json and pnpm-lock.yaml have been founded', async () => {
    const mockFiles = ['package.json', 'someFile.ts', 'pnpm-lock.yaml'];

    mockedReaddir.mockImplementationOnce((path, callback: any) => {
      callback(null, mockFiles);
    });
    const result = await getPackageManager('somePath');
    expect(result).toBe('pnpm');
  });

  it('shoud resolve "npm" when only package.json has been founded', async () => {
    const mockFiles = ['package.json', 'someFile.ts', 'pnpm-lock.yaml'];

    mockedReaddir.mockImplementationOnce((path, callback: any) => {
      callback(null, mockFiles);
    });
    const result = await getPackageManager('somePath');
    expect(result).toBe('pnpm');
  });

  it('shoud resolve undefined when package.json has not been founded', async () => {
    const mockFiles = [
      'package.js',
      'someFile.ts',
      'pnpm-lock.yaml',
      'yarn.lock',
    ];

    mockedReaddir.mockImplementationOnce((path, callback: any) => {
      callback(null, mockFiles);
    });
    const result = await getPackageManager('somePath');
    expect(result).toBe(undefined);
  });
});

describe('getExecutableDirectories', () => {
  it('shoud empty array when isExecuatble is false', async () => {
    jest
      .spyOn(FileUtilsModule, 'getPackageManager')
      .mockResolvedValue(undefined);
    const result = await getExecutableDirectories(['dir1', 'dir2', 'dir3']);
    expect(result.length).toBe(0);
  });

  it('shoud full array when isExecuatble is true', async () => {
    jest.spyOn(FileUtilsModule, 'getPackageManager').mockResolvedValue('npm');
    const result = await getExecutableDirectories(['dir1', 'dir2', 'dir3']);
    expect(result.length).toBe(3);
  });
});
