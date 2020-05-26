import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import execa from 'execa';
import chalk from 'chalk';
import { createProject } from './main';

async function getConfig(rawArgs) {
  const args = arg(
    {},
    {
      argv: rawArgs.slice(2),
    }
  );
  const options = {
    directory: args._[0],
  };

  const questions = [];
  if (!options.directory) {
    questions.push({
      name: 'directory',
      message: 'Please enter your project name',
      default: 'api',
    });
  }

  const answers = await inquirer.prompt(questions);

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../template'
  );
  const targetDirectory = `${process.cwd()}/${options.directory ||
    answers.directory}`;

  try {
    await execa('yarn', ['--version'], {
      cwd: targetDirectory,
    });
    options.pkgMgr = 'yarn';
    options.flags = ['add'];
    options.devFlags = ['--dev'];
  } catch (error) {
    options.pkgMgr = 'npm';
    options.flags = ['install'];
    options.devFlags = ['-D'];
  }
  return {
    pkgMgr: options.pkgMgr,
    flags: options.flags,
    devFlags: options.devFlags,
    directory: options.directory || answers.directory,
    templateDirectory: templateDir,
    targetDirectory,
  };
}

export async function cli(args) {
  const options = await getConfig(args);
  await createProject(options);
  console.log('%s Installation Complete', chalk.green.bold('DONE'));
}
