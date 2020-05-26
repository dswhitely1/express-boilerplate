import { packageListGenerator, taskListGenerator } from './utils';

const packages = {
  express: ['express'],
  middleware: ['helmet', 'cors', 'compression'],
};

const devPackages = {
  typescript: ['typescript', 'tsc-watch'],
  types: [
    '@types/node',
    '@types/express',
    '@types/cors',
    '@types/helmet',
    '@types/compression',
  ],
  gitTools: ['husky', 'lint-staged'],
  other: ['rimraf'],
};

export const packageList = options => {
  const pkgList = {};

  Object.keys(packages).forEach(pkgs => {
    pkgList[pkgs] = packageListGenerator(
      options.pkgMgr,
      options.flags,
      packages[pkgs],
      options
    );
  });

  Object.keys(devPackages).forEach(
    pkgs =>
      (pkgList[pkgs] = packageListGenerator(
        options.pkgMgr,
        [...options.flags, ...options.devFlags],
        devPackages[pkgs],
        options
      ))
  );

  const dependencies = Object.keys(packages).map(pkgs => pkgList[pkgs]);
  const devDependencies = Object.keys(devPackages).map(pkgs => pkgList[pkgs]);

  const dependencyTask = taskListGenerator('Dependencies', dependencies);
  const devDependencyTask = taskListGenerator(
    'Development Dependencies',
    devDependencies
  );

  return taskListGenerator('Project Install', [
    dependencyTask,
    devDependencyTask,
  ]);
};
