// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const importPlugin = require("eslint-plugin-import");
const unusedImports = require("eslint-plugin-unused-imports");
const eslintPluginSortExportAll = require("eslint-plugin-sort-export-all");
const prettierPlugin = require("eslint-config-prettier/flat");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      prettierPlugin,
    ],
    plugins: {
      "unused-imports": unusedImports,
      "sort-export-all": eslintPluginSortExportAll.default,
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "lib",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "lib",
          style: "kebab-case",
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
        },
      ],
      "import/no-unresolved": 0,
      "import/order": [
        "error",
        {
          pathGroups: [
            {
              pattern: "@angular/**",
              group: "builtin",
            },
            {
              pattern: "rxjs/**",
              group: "builtin",
            },
            {
              pattern: "rxjs",
              group: "builtin",
            },
            {
              pattern: "@lib/**",
              group: "internal",
            },
            {
              pattern: "@core/**",
              group: "internal",
            },
            {
              pattern: "@shared/**",
              group: "internal",
            },
            {
              pattern: "@views/**",
              group: "internal",
            },
          ],
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "unused-imports/no-unused-imports": 2,
      "sort-export-all/sort-export-all": 2,
      "no-console": 2,
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
