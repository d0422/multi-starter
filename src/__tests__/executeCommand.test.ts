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
});

afterAll(() => {
  console.error = temp;
});

describe('test executeCommand', () => {
  it('if executable is true, it can spawn process', () => {
    executeCommand(
      { path: 'somePath', executable: true, packageManager: 'npm' },
      'install'
    );
    expect(childProcess.spawn).toHaveBeenCalledWith('npm', ['install'], {
      cwd: 'somePath',
      stdio: 'inherit',
    });
  });

  it('if executable is false, it does not spawn process', () => {
    executeCommand(
      { path: 'somePath', executable: false, packageManager: 'yarn' },
      'start'
    );
    expect(childProcess.spawn).not.toHaveBeenCalledWith(
      'yarn',
      ['run', 'start'],
      { cwd: 'somePath', stdio: 'inherit' }
    );
  });
});
