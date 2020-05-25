import arg from 'arg';
import inquirer from 'inquirer';

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

  return {
    directory: options.directory || answers.directory,
  };
}

export async function cli(args) {
  const options = await getConfig(args);
  console.log(options);
}
