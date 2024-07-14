export type PackageManager = 'yarn' | 'pnpm' | 'npm';

export interface ExecutableDirectory {
  path: string;
  packageManager: PackageManager;
}

export interface CommandObject {
  path: string;
  executable: boolean;
  packageManager: PackageManager;
}

export interface PackageJson {
  scripts: Record<string, string>;
}
