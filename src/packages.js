import { packageListGenerator, taskListGenerator } from './utils';

const packages = {
  Express: ['express'],
  Middleware: ['helmet', 'cors', 'compression'],
  'Build Tools': ['rimraf'],
};

const devPackages = {
  TypeScript: ['typescript', 'tsc-watch'],
  Types: [
    '@types/node',
    '@types/express',
    '@types/cors',
    '@types/helmet',
    '@types/compression',
  ],
  'Git Tools': ['husky', 'lint-staged'],
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

  const taskList = {};

  Object.keys(pkgList).forEach(pkgs => {
    taskList[pkgs] = taskListGenerator(`${pkgs}`, pkgList[pkgs]);
  });

  const dependencies = Object.keys(packages).map(pkgs => taskList[pkgs]);
  const devDependencies = Object.keys(devPackages).map(pkgs => taskList[pkgs]);

  const dependencyTask = taskListGenerator('Dependencies', [...dependencies]);
  const devDependencyTask = taskListGenerator('Development Dependencies', [
    ...devDependencies,
  ]);

  return taskListGenerator('Project Install', [
    dependencyTask,
    devDependencyTask,
  ]);
};
