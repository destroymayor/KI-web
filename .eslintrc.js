module.exports = {
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
    },
  },
  rules: {
    'no-inner-declarations': [2, 'functions'],
    'no-unused-vars': 'warn',
    'no-unexpected-multiline': 'warn',
  },
  env: {
    browser: true,
    node: true,
  },
};
