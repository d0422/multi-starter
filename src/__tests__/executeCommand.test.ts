import { executeCommand } from '../executeCommand';
import childProcess from 'child_process';

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
});
