import execa from 'execa';
import Listr from 'listr';

export const packageListGenerator = (
  packageManager,
  flags,
  packages,
  options
) =>
  packages.map(pkg => ({
    title: `Installing ${pkg}`,
    task: async () => {
      const result = await execa(packageManager, [...flags, pkg], {
        cwd: options.targetDirectory,
      });
      if (result.failed) {
        throw new Error(`Failed to install ${pkg}`);
      }
    },
  }));

export const listGenerator = (title, command, args, options) => ({
  title,
  task: async () => {
    const result = await execa(command, args, {
      cwd: options.targetDirectory,
    });
    if (result.failed) {
      throw new Error(`Failed to execute "${title}"`);
    }
  },
});

export const taskListGenerator = (title, tasks, isEnable = true) => ({
  title,
  task: () => new Listr(tasks),
  enabled: () => isEnable,
});
