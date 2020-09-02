// To format, run: `.\node_modules\.bin\eslint --fix .eslintrc.js --ignore-pattern '!.eslintrc.js'`

/* eslint comma-dangle: ["error", "never"] */
/* eslint quotes: ["error", "double"] */
/* eslint quote-props: ["error", "always"] */

module.exports = {
  "root": true,
  "env": { "node": true },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/airbnb"
  ],
  "rules": {
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "state"
        ]
      }
    ],
    "no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "object-curly-newline": ["warn", {
      "ObjectExpression": { "multiline": true, "minProperties": 4 },
      "ObjectPattern": "never",
      "ImportDeclaration": "never",
      "ExportDeclaration": { "multiline": true, "minProperties": 4 }
    }],
    "object-property-newline": "warn",
    "object-shorthand": ["error", "always"]
  },
  "parserOptions": { "parser": "babel-eslint" }
};
