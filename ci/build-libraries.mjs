import { $ } from 'zx';
import fs from 'fs';
import { Libs } from './libs.mjs';
import { cpus } from 'os';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;
/**
 * reserving one for master
 */
const CPUs = cpus().length - 1;

$.shell = '/bin/zsh';
$.prefix = '';
$.verbose = false;

process.env.FORCE_COLOR = 3;

const commands = [
  [
    { name: Libs.Rxjs, needs: [] },
    { name: Libs.Forms, needs: [] },
    { name: Libs.SelectionModel, needs: [] },
    { name: Libs.Scroll, needs: [] },
    { name: Libs.Tables, needs: [] },
    { name: Libs.Control, needs: [] },
    { name: Libs.Dropdown, needs: [] },
    { name: Libs.Cal, needs: [] },
  ],
  [
    { name: Libs.Select, needs: [Libs.SelectionModel] },
    { name: Libs.FormField, needs: [Libs.Control] },
    { name: Libs.Input, needs: [Libs.Control] },
    { name: Libs.Textarea, needs: [Libs.Control] },
  ]
];

const libHash = (name) => $`git rev-parse --verify --quiet HEAD:projects/${name}/`;
const libHashPath = (name) => `dist/${name}/.hash`;

const build = (name) =>
  $`./node_modules/.bin/ng build ${name} --configuration=${argv.production ? 'production' : 'development'}`;

const printNewLevelMessage = () => {
  console.log('\x1b[34m******************************************************************************\x1b[0m');
  console.log('\x1b[34m                                  New level                                   \x1b[0m');
  console.log('\x1b[34m******************************************************************************\x1b[0m');
  console.log();
};

const printSuccessNGCCMessage = ({ stdout }) => {
  console.log(`\x1b[32m------------------------------------------------------------------------------\x1b[0m`);
  console.log(`\x1b[32mCreate entry points\x1b[0m`);
  console.log(`\x1b[32m${stdout}\x1b[0m`);
  console.log(`\x1b[32m------------------------------------------------------------------------------\x1b[0m`);
};

const printSuccessLibMessage = (name, { stdout, stderr }) => {
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m                                   ${name}                                    \x1b[0m`);
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m${stdout}\x1b[0m`);
  console.log(`\x1b[31m${stderr}\x1b[0m`);
  console.log('\x1b[32m******************************************************************************\x1b[0m');
  console.log();
  console.log();
};

const printErrorLibMessage = (name, { stdout, stderr }) => {
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log(`\x1b[31m                              ${name} error                                   \x1b[0m`);
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log(`\x1b[32m${stdout}\x1b[0m`);
  console.log(`\x1b[31m${stderr}\x1b[0m`);
  console.log('\x1b[31m******************************************************************************\x1b[0m');
  console.log();
  console.log();
};

const builded = new Set();

const maxNameLength = Math.max(...commands.flatMap((level) => level.map(({ name }) => name.length)));

async function checkLibs(chunk) {
  const libsPromiseHashes = chunk.map(({ name }) => libHash(name));
  const libsHashes = (await Promise.allSettled(libsPromiseHashes)).map(({ status, value }) =>
    status === 'fulfilled' ? value.stdout : '',
  );

  return chunk
    .map((lib, i) => ({ ...lib, hash: libsHashes[i] }))
    .filter(({ name, needs, hash }) => {
      const distHash = fs.existsSync(libHashPath(name)) ? fs.readFileSync(libHashPath(name), { encoding: 'utf8' }) : '';

      const currentHash = hash.replace('\n', '');
      const lastHash = distHash.replace('\n', '');

      const checkParent = needs.some((parent) => builded.has(parent));
      const checkHash = currentHash === '' || lastHash === '' || currentHash !== lastHash;

      const parentCheck = checkParent ? `\x1b[31m✘\x1b[0m` : `\x1b[32m✔\x1b[0m`;
      const hashCheck = checkHash ? `\x1b[31m✘\x1b[0m` : `\x1b[32m✔\x1b[0m`;

      console.log(
        `\x1b[42m\x1b[30m ${name.padEnd(
          maxNameLength,
          ' ',
        )} \x1b[0m -> parent: ${parentCheck} -> hash: \x1b[32m${currentHash.padEnd(
          40,
          '-',
        )}\x1b[0m, distHash: \x1b[31m${lastHash.padEnd(40, '-')} \x1b[0m${hashCheck}`,
      );

      return (
        // alow when a parent is changed
        checkParent ||
        // check if version are deferent
        checkHash
      );
    });
}

const stack = new Set();
/**
 * skip next command if previous one failed
 */
let skipIsError = false;

async function buildLibs(chunk, chunks) {
  /**
   * returns when the number of libs in the stack equals the number of processors
   */
  if (stack.size === CPUs) return;

  // return when current chunk is already builded but runStack is not empty
  if (chunk.length === 0 && stack.size !== 0) return;

  // return when all chunks are built
  if (chunk.length === 0 && chunks.length === 0) return;

  let level;

  if (chunk.length) {
    level = chunk;
  } else {
    printNewLevelMessage();
    /**
     * recreate dist folder
     * if doesn't exist
     */
    await $`mkdir -p dist`;
    /**
     * prebuilt all previous libs when is starting to build a new level
     */
    const ngcc = await $`./node_modules/.bin/ngcc --source dist --create-ivy-entry-points`;

    printSuccessNGCCMessage(ngcc);

    level = await checkLibs(chunks.shift());
  }
  /**
   * when the level has nothing to change, move on to the next level
   */
  if (!level.length) return buildLibs(level, chunks);

  const { name, hash } = level.shift();

  const command = build(name);
  stack.add(command);

  command
    .then((output) => {
      if (skipIsError) return;

      stack.delete(command);
      /**
       * add to the build to see if the next level will have a library dependent on this library
       */
      builded.add(name);
      /**
       * add hash to dist to know what the library hash was when it was built
       */
      fs.writeFileSync(libHashPath(name), hash, { encoding: 'utf8' });

      printSuccessLibMessage(name, output);

      buildLibs(level, chunks);
    })
    .catch(async (output) => {
      if (skipIsError) return;

      skipIsError = true;
      /**
       * wait to kill all tasks that are running
       */
      await Promise.all([...stack].map((process) => process.kill()));

      printErrorLibMessage(name, output);
      /**
       * exit from build script because one of the libraries failed to build
       */
      process.exit(output.exitCode);
    });

  buildLibs(level, chunks);
}

console.log(`\x1b[32mNumber of CPUs: ${CPUs}\x1b[0m`);
console.log();

const ngcc = await $`./node_modules/.bin/ngcc --source node_modules --create-ivy-entry-points`;

printSuccessNGCCMessage(ngcc);

process.env.NGCC_MAX_WORKERS = CPUs;
process.env.BAZEL_TARGET = true;

await buildLibs(
  [],
  commands.map((level) => [...level]),
);
