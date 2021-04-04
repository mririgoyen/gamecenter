module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'plugin:react/recommended'
  ],
  globals: {
    Emulator: true,
    JSEvents: true,
    MAMELoader: true,
    Module: true,
    productConfig: true
  },
  ignorePatterns: [
    '**/client/assets/emulators/*.js',
    'modules/avataaars'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'jest',
    'react-hooks',
    'sort-destructure-keys'
  ],
  rules: {
    'arrow-parens': [ 2 ],
    'brace-style': 2,
    camelcase: 0,
    'comma-dangle': 0,
    'comma-spacing': [ 2, { after: true, before: false } ],
    curly: [ 2, 'all' ],
    indent: [ 2, 2, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] } ],
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,
    'jest/consistent-test-it': [ 2, { fn: 'it', withinDescribe: 'it' } ],
    'jest/no-jest-import': 2,
    'jest/no-test-prefixes': 2,
    'jest/no-test-return-statement': 2,
    'jsx-quotes': [ 2, 'prefer-single' ],
    'key-spacing': [ 2, { beforeColon: false, afterColon: true } ],
    'keyword-spacing': [ 2, { overrides: { else: { before: true } } } ],
    'linebreak-style': [ 2, 'unix' ],
    'max-len': 0,
    'no-debugger': 2,
    'no-dupe-keys': 2,
    'no-else-return': 0,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': 2,
    'no-template-curly-in-string': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-unused-vars': [ 2, { vars: 'all', args: 'after-used', ignoreRestSiblings: true } ],
    'no-var': 1,
    'no-with': 2,
    'one-var': 0,
    'padded-blocks': [ 2, 'never' ],
    'prefer-arrow-callback': 2,
    'prefer-destructuring': [ 2, { array: false, object: true } ],
    'prefer-template': 2,
    'quote-props': [ 2, 'as-needed' ],
    quotes: [ 2, 'single' ],
    'react-hooks/exhaustive-deps': 1,
    'react-hooks/rules-of-hooks': 2,
    'react/jsx-sort-props': [ 2, { ignoreCase: true } ],
    'react/jsx-uses-react': 0,
    'react/no-unused-prop-types': 2,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/self-closing-comp': 2,
    semi: [ 2, 'always' ],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'space-before-blocks': [ 2, 'always' ],
    'space-in-parens': [ 2, 'never' ],
    'space-infix-ops': 2,
    'space-unary-ops': [ 2, { nonwords: false } ],
    'spaced-comment': [ 2, 'always' ]
  },
  settings: {
    react: {
      version: '17.0'
    }
  }
};
