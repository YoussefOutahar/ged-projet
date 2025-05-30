module.exports = {
    env: {
      browser: true,
      es6: true,
      jest: true,
    },
    extends: [
      "airbnb-typescript",
      "airbnb/hooks",
      "plugin:@next/next/recommended",
      "plugin:@next/next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2021,
      sourceType: "module",
      project: "./tsconfig.json",
    },
    plugins: [
      "@typescript-eslint",
      "import",
      "jsx-a11y",
      "prettier",
      "react",
      "react-hooks",
      "sort-destructure-keys",
      "typescript-sort-keys",
    ],
    rules: {
      "no-multiple-empty-lines": ["error", { max: 2, maxBOF: 1 }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: false,
          variables: true,
          enums: true,
          typedefs: true,
          ignoreTypeReferences: true,
        },
      ],
      "arrow-body-style": [
        "error",
        "as-needed",
        {
          requireReturnForObjectLiteral: false,
        },
      ],
      "no-underscore-dangle": "off",
      "no-use-before-define": "off",
      "react/jsx-filename-extension": [
        1,
        {
          extensions: ["js", "jsx", ".ts", ".tsx"],
        },
      ],
      "react/jsx-props-no-spreading": "off",
      "react/no-array-index-key": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "off",
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
      "import/no-anonymous-default-export": "error",
      "import/no-extraneous-dependencies": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
      "sort-destructure-keys/sort-destructure-keys": [2, { caseSensitive: true }],
      "typescript-sort-keys/interface": [
        "error",
        "asc",
        { caseSensitive: true, natural: false, requiredFirst: false },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["./app"],
          extensions: [".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
    },
  };
  