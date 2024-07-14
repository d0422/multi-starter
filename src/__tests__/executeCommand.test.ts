import { executeCommand } from '../executeCommand';
import * as MockExecutableCommandObject from '../executeCommand';
import childProcess from 'child_process';
import { CommandObject, PackageManager } from '../type';

jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    on: jest.fn(),
  })),
}));
const temp = console.error;

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  console.error = jest.fn();
  Object.defineProperty(process, 'platform', {
    value: 'darwin', //default platform is MacOS
  });
});

afterAll(() => {
  console.error = temp;
});

describe('test executeCommand', () => {
  it('should spawn process when executable is true', () => {
    executeCommand(
      { path: 'somePath', executable: true, packageManager: 'npm' },
      'install'
    );
    expect(childProcess.spawn).toHaveBeenCalledWith('npm', ['install'], {
      cwd: 'somePath',
      stdio: 'inherit',
      shell: false,
    });
  });

  it('should not spawn process when executable is false, ', () => {
    executeCommand(
      { path: 'somePath', executable: false, packageManager: 'yarn' },
      'start'
    );
    expect(childProcess.spawn).not.toHaveBeenCalledWith(
      'yarn',
      ['run', 'start'],
      { cwd: 'somePath', stdio: 'inherit', shell: false }
    );
  });

  it('should set shell to true when OS is Windows', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });
    executeCommand(
      { path: 'somePath', executable: true, packageManager: 'yarn' },
      'start'
    );
    expect(childProcess.spawn).toHaveBeenCalledWith('yarn', ['run', 'start'], {
      cwd: 'somePath',
      stdio: 'inherit',
      shell: true,
    });
  });

  it('should call executeMultipleCommand when command is instlal + dev or install + start', () => {
    jest.spyOn(MockExecutableCommandObject, 'executeMultipleCommand');
    const callObject = {
      executable: true,
      path: 'somePath',
      packageManager: 'npm' as PackageManager,
    };

    executeCommand(callObject, 'install + dev');
    expect(
      MockExecutableCommandObject.executeMultipleCommand
    ).toHaveBeenCalledWith(callObject, 'install + dev');

    executeCommand(callObject, 'install + start');
    expect(
      MockExecutableCommandObject.executeMultipleCommand
    ).toHaveBeenCalledWith(callObject, 'install + start');
  });
});
