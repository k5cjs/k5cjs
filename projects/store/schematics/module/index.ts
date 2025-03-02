/* eslint-disable @typescript-eslint/require-await */
import { normalize, strings, virtualFs, workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

import { Schema as StoreSchema } from './schema';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);

      if (!data) throw new SchematicsException('File not found.');

      return virtualFs.fileBufferToString(data);
    },

    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },

    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },

    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function module(options: StoreSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);
    const project = options.project != null ? workspace.projects.get(options.project) : null;

    if (!project) throw new SchematicsException(`Invalid project name: ${options.project}`);

    const projectType = (project.extensions as { projectType: string }).projectType === 'application' ? 'app' : 'lib';

    if (options.path === undefined) options.path = `${project.sourceRoot}/${projectType}`;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name,
        type: options.type || options.name,
      }),
      move(normalize(options.path)),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
