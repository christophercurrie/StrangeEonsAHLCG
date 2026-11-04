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
    `!${diy}/Asset.js`,
    `!${diy}/Event.js`,
    `!${diy}/Skill.js`,
    `!${diy}/Key.js`,
    `!${diy}/Location.js`,
    `!${diy}/LocationLocation.js`,
    `!${diy}/Chaos.js`,
    `!${diy}/Customizable.js`,
    `!${diy}/Enemy.js`,
    `!${diy}/StoryEnemy.js`,
    `!${diy}/StoryStory.js`,
    `!${diy}/Treachery.js`,
    `!${diy}/TreacheryStory.js`,
    `!${diy}/WeaknessEnemy.js`,
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
      }
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-restricted-syntax": ["error", "ClassDeclaration", "ClassExpression"],
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }]
    },
  },
  // scripts run as they are, not as modules, still use the Rhino globals
  {
    files: [amd, `${renderTest}/**/*.js`],
    languageOptions: {
      globals: { java: "readonly", javax: "readonly", arkham: "readonly" },
    },
  },
]);
