module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "no-inner-declarations": [2, "functions"],
    "no-unused-vars": "warn",
    "no-unexpected-multiline": "warn",
    "no-console": "off"
  },
  env: {
    browser: true,
    node: true
  }
};
