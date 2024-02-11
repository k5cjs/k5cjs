module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        createDefaultProgram: false,
      },
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'kc',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'kc',
            style: 'kebab-case',
          },
        ],
      },
      overrides: [
        {
          files: ['*.cy.ts'],
          parserOptions: {
            project: ['./tsconfig.cy.json'],
            createDefaultProgram: true,
          },
        },
        {
          files: ['*.spec.ts'],
          parserOptions: {
            project: ['./tsconfig.spec.json'],
            createDefaultProgram: true,
          },
        },
      ],
    },
    {
      files: ['*.html'],
      rules: {},
    },
  ],
};
