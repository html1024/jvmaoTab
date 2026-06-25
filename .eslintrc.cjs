module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  globals: {
    chrome: "readonly",
    browser: "readonly",
  },
  rules: {
    "react-refresh/only-export-components": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unknown-property": ["error", { ignore: ["t", "p-id"] }],
  },
};
