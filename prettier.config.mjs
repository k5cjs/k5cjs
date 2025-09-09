/**
 * @see https://prettier.io/docs/configuration
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
const config = {
  // plugins: ["prettier-plugin-tailwindcss"],
  // tailwindStylesheet: "./projects/shell/src/tailwind.css",
  printWidth: 120,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "ignore",
  trailingComma: "all",
  quoteProps: "as-needed",
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "html",
      },
    },
    {
      files: "*.component.html",
      options: {
        parser: "angular",
      },
    },
  ],
};

export default config;
