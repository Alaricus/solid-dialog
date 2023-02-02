module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint-config-airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/typescript',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'solid',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'function-paren-newline': 0,
    'import/no-extraneous-dependencies': 0,
    'no-confusing-arrow': 0,
    'no-class-assign': 0,
    'no-use-before-define': ['error', { variables: false }],
    'no-multi-spaces': [2, { exceptions: { ObjectExpression: true } }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'max-len': ['error', 140],
    'object-curly-newline': 0,
    'linebreak-style': ['error', 'windows'],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'arrow-parens': ['error', 'as-needed'],
    'import/extensions': [2, { js: 'never', json: 'always' }],
    'import/no-unresolved': 0, // disabling due to using vite, not webpack
  },
};
