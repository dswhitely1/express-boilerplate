import Listr from 'listr';
import { preInstall } from './config';
import { packageList } from './packages';
import { taskListGenerator } from './utils';

export const createProject = async options => {
  const preInstallation = await preInstall(options);
  const packageInstall = packageList(options);

  const application = taskListGenerator('Express API', [
    preInstallation,
    packageInstall,
  ]);

  const tasks = new Listr([application]);

  await tasks.run();

  return true;
};
