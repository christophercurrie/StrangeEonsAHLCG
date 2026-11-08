import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const resources = "ArkhamHorrorLCG/ArkhamHorrorLCG/resources";
const renderTest = "src/renderTest";

const rules = {
  eqeqeq: ["error", "always", { null: "ignore" }],
  "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }],
  "no-array-constructor": ["error"],
};

export default defineConfig([
  globalIgnores(["**/*.js", "**/*.mjs", `!${resources}/**/*.mjs`, `!${renderTest}/**/*.js`]),
  // the plug-in's modules, run by the ECMAScript script language
  {
    extends: ["js/recommended", eslintConfigPrettier],
    files: [`${resources}/**/*.mjs`],
    plugins: { js },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { Java: "readonly" },
    },
    rules,
  },
  // the render-test script, run on Rhino with its globals
  {
    extends: ["js/recommended", eslintConfigPrettier],
    files: [`${renderTest}/**/*.js`],
    plugins: { js },
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: "script",
      globals: { java: "readonly", javax: "readonly", arkham: "readonly" },
    },
    rules: { ...rules, "no-restricted-syntax": ["error", "ClassDeclaration", "ClassExpression"] },
  },
]);
