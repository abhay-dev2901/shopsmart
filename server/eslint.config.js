import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "dist/"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "semi": ["error", "always"],
      "quotes": ["warn", "double"],
    },
  },
];
