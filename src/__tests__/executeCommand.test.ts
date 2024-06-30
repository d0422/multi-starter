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
    executeCommand({ path: 'somePath', executable: true }, 'install');
    expect(childProcess.spawn).toHaveBeenCalled();
  });

  it('if executable is false, it does not spawn process', () => {
    executeCommand({ path: 'somePath', executable: false }, 'run');
    expect(childProcess.spawn).not.toHaveBeenCalled();
  });
});
