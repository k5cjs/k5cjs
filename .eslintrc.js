module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
      ],
      plugins: ['unused-imports', 'sort-export-all', '@ngrx'],
      rules: {
        'max-len': ['error', 120],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unused-vars': [
          2,
          {
            ignoreRestSiblings: true,
          },
        ],
        'unused-imports/no-unused-imports': 2,
        'sort-imports': [
          'error',
          {
            ignoreCase: false,
            ignoreDeclarationSort: true,
          },
        ],
        'import/no-unresolved': 0,
        'import/order': [
          'error',
          {
            pathGroups: [
              {
                pattern: '@angular/**',
                group: 'builtin',
              },
              {
                pattern: 'rxjs/**',
                group: 'builtin',
              },
              {
                pattern: 'rxjs',
                group: 'builtin',
              },
              {
                pattern: '@lib/**',
                group: 'internal',
              },
              {
                pattern: '@core/**',
                group: 'internal',
              },
              {
                pattern: '@shared/**',
                group: 'internal',
              },
              {
                pattern: '@views/**',
                group: 'internal',
              },
            ],
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'sort-export-all/sort-export-all': 2,
        'no-console': 2,
      },
    },
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:@angular-eslint/template/accessibility',
        'prettier',
      ],
      rules: {},
    },
    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
  ],
};
