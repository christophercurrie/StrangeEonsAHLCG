import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const resources = "ArkhamHorrorLCG/ArkhamHorrorLCG/resources";
const diy = `${resources}/ArkhamHorrorLCG/diy`;
const amd = `${resources}/libraries/amd.js`;
const renderTest = "src/renderTest";

export default defineConfig([
  // legacy scripts use SE's $, @ and # notation; only the new modules are linted
  globalIgnores([
    "**/*.js",
    "**/*.mjs",
    `!${diy}/Flexible.js`,
    // legacy card types moved to faces
    `!${diy}/Chaos.js`,
    `!${diy}/Enemy.js`,
    `!${diy}/StoryEnemy.js`,
    `!${diy}/StoryStory.js`,
    `!${diy}/Treachery.js`,
    `!${diy}/TreacheryStory.js`,
    `!${diy}/WeaknessTreachery.js`,
    `!${diy}/faces/**/*.js`,
    `!${diy}/handlers/**/*.js`,
    `!${diy}/se/**/*.js`,
    `!${diy}/ui/**/*.js`,
    `!${amd}`,
    `!${renderTest}/**/*.js`,
  ]),
  {
    extends: ["js/recommended", eslintConfigPrettier],
    files: [`${diy}/**/*.js`, amd, `${renderTest}/**/*.js`],
    plugins: { js },
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: "script",
      globals: {
        define: "readonly",
        java: "readonly",
        javax: "readonly",
        arkham: "readonly",
      }
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-restricted-syntax": ["error", "ClassDeclaration", "ClassExpression"],
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }]
    },
  },
]);
