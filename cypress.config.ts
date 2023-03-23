import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      options: {
        projectConfig: {
          root: '',
          sourceRoot: 'projects/examples/src',
          buildOptions: {
            tsConfig: 'projects/examples/tsconfig.cy.json',
          },
        },
      },
    },
    specPattern: '**/*.cy.ts',
  },
});
