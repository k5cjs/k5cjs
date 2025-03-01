import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      options: {
        projectConfig: {
          root: '',
          sourceRoot: 'projects/docs/src',
          buildOptions: {
            tsConfig: 'projects/docs/tsconfig.cy.json',
          },
        },
      },
    },
    specPattern: '**/*.cy.ts',
  },
});
