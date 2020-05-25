import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import { packageList } from './packages';

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
  return {
    directory: options.directory || answers.directory,
    templateDirectory: templateDir,
    targetDirectory,
  };
}

export async function cli(args) {
  const options = await getConfig(args);
  packageList(options);
  console.log(options);
}
