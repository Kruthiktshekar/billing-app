import globals from "globals";

export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'module'}},
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      eqeqeq: 'warn',
      curly: 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
    },
  }
];