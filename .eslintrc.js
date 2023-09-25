module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    },
    {
      "env": {
        "node": true,
        "es2021": false,
        "amd": true
      },
      "files": [
        "generateAssets.js"
      ],
      "rules": {
        "no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "import"
  ],
  "rules": {
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1
      }
    ],
    "react/react-in-jsx-scope": "off",
    "import/newline-after-import": "error",
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": "if", "next": "*" }
    ]
  }
};
