import { $ } from 'zx';
import { Libs } from './libs.mjs';
import { Apps } from './apps.mjs';
import { cpus } from 'os';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;
const nbCPUs = cpus().length;

$.shell = '/bin/zsh';
$.prefix = '';
$.verbose = false;

process.env.FORCE_COLOR = 3;

const fix = argv.fix ? `--write` : `--check`;

const lint = (name) =>
  $`./node_modules/.bin/prettier \
${fix} \
"./projects/${name}/**/*.{ts,html,json}"`;

const libs = [
  Libs.Rxjs,
  Libs.Forms,
  Libs.SelectionModel,
  Libs.Select,
  Libs.Scroll,
  Libs.Tables,
  Libs.Control,
  Libs.Input,
  Libs.Textarea,
  Libs.FormField,
  Libs.Dropdown,
  Libs.Cal,
];

const apps = [
  Apps.Examples,
];

const lints = [...libs, ...apps];

const printSuccessLintMessage = (name, { stdout, stderr }) => {
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m                                   ${name}                                    \x1b[0m`);
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m${stdout}\x1b[0m`);
  console.log(`\x1b[31m${stderr}\x1b[0m`);
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log();
  console.log();
};

const printErrorLintMessage = (name, { stdout, stderr }) => {
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log(`\x1b[31m                              ${name} error                                   \x1b[0m`);
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m${stdout}\x1b[0m`);
  console.log(`\x1b[31m${stderr}\x1b[0m`);
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log();
  console.log();
};

const stack = new Set();
/**
 * skip next command if previous one failed
 */
let skipIsError = false;
/**
 *
 * @param {*} max maximum amount of parallel tasks?
 * @returns
 */
function run() {
  if (!lints.length) return;

  if (stack.size < nbCPUs) {
    // the number of tasks that need to be added to run in parallel
    const maxNewTask = nbCPUs - stack.size;

    for (let i = 0; i < maxNewTask; i++) {
      if (!lints.length) return;

      const name = lints.shift();

      const command = lint(name);
      stack.add(command);

      command
        .then((output) => {
          if (skipIsError) return;

          printSuccessLintMessage(name, output);
          stack.delete(command);
          run();
        })
        .catch(async (output) => {
          if (skipIsError) return;

          skipIsError = true;
          /**
           * wait to kill all tasks that are running
           */
          await Promise.all([...stack].map((process) => process.kill()));

          printErrorLintMessage(name, output);
          /**
           * exit from build script because one of the libraries failed to build
           */
          process.exit(output.exitCode);
        });
    }
  }
}

run();
