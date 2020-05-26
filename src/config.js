import fs from 'fs';
import { listGenerator, taskListGenerator } from './utils';

const husky = {
  hooks: {
    precommit: 'lint-staged',
  },
};

const lintStaged = {
  '*.{js,ts}': 'eslint . --fix',
};

const eslintConfig = {
  extends: ['wesbos'],
};

const scripts = {
  prebuild: 'rimraf dist',
  build: 'npx tsc',
  dev: 'tsc-watch --onSuccess "node dist/index.js"',
  start: 'node dist/index.js',
};

const addToPkgJson = options => {
  const filename = `${options.targetDirectory}/package.json`;

  const rawData = fs.readFileSync(filename);
  const data = JSON.parse(rawData);
  const newData = {
    ...data,
    husky,
    scripts,
    'lint-staged': lintStaged,
    eslintConfig,
  };
  const jsonData = JSON.stringify(newData, null, 2);
  fs.writeFileSync(filename, jsonData);
};

const gitSetup = options => {
  const gitInit = listGenerator('Initializing Git', 'git', ['init'], options);
  const gitIgnore = listGenerator(
    'Installing GitIgnore File',
    'npx',
    ['gitignore', 'node'],
    options
  );
  return taskListGenerator('Git', [gitInit, gitIgnore]);
};

const npmSetup = options => {
  const npmInit = listGenerator(options.pkgMgr, ['init'], options);
  const pkgJson = {
    title: 'Adding to Package JSON',
    task: () => addToPkgJson(options),
  };
  return taskListGenerator('Npm Setup', [npmInit, pkgJson]);
};

const esLintSetup = options => {
  const esLintInstall = listGenerator(
    'EsLint Install',
    'npx',
    ['install-peerdeps', '--dev', 'eslint-config-wesbos'],
    options
  );

  return taskListGenerator('EsLint Install', [esLintInstall]);
};

export const preInstall = options => {
  const git = gitSetup(options);
  const npm = npmSetup(options);
  const esLint = esLintSetup(options);

  return taskListGenerator('PreInstall', [git, npm, esLint]);
};
