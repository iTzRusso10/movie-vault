// @ts-check
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
// @ts-expect-error missing types
import reactCompilerPlugin from "eslint-plugin-react-compiler";
// @ts-expect-error missing types
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
// @ts-expect-error missing types
import tailwindPlugin from "eslint-plugin-tailwindcss";
// @ts-expect-error missing types
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["src/**"],
    plugins: {
      "react-compiler": reactCompilerPlugin,
      "react-hooks": reactHooksPlugin,
      react: reactPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "react/display-name": 2,
      "react/jsx-no-leaked-render": 1,
      "react/no-children-prop": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "react-compiler/react-compiler": 2,
      "react-hooks/exhaustive-deps": 2,
      "block-scoped-var": 2,
      "default-param-last": 0,
      "getter-return": 2,
      "grouped-accessor-pairs": 1,
      "max-params": [2, 4],
      "new-cap": 1,
      "no-alert": 2,
      "no-case-declarations": 1,
      "no-class-assign": 2,
      "no-cond-assign": 0,
      "no-console": 0,
      "no-const-assign": 2,
      "no-constructor-return": 2,
      "no-dupe-args": 2,
      "no-duplicate-imports": 1,
      "no-eq-null": 1,
      "no-eval": 2,
      "no-extend-native": 2,
      "no-extra-semi": 0,
      "no-implied-eval": 2,
      "no-invalid-this": 2,
      "no-mixed-operators": 0,
      "no-multi-assign": 2,
      "no-multi-str": 2,
      "no-template-curly-in-string": 1,
      "no-unused-vars": "off",
      "no-var": 0,
      "prefer-template": 0,
      "prefer-const": 0,
      "no-ex-assign": 2,
      "spaced-comment": [
        1,
        "always",
        {
          markers: ["/"],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "process",
          message: "Use env.*** instead",
        },
        {
          name: "fdescribe",
          message: "Do not commit fdescribe. Use describe instead.",
        },
      ],
      eqeqeq: 2,
      "@typescript-eslint/ban-types": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/unbound-method": 0,
      "@typescript-eslint/no-empty-function": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-namespace": 0,
      "@typescript-eslint/no-unnecessary-condition": 2,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-unsafe-call": 0,
      "@typescript-eslint/no-unsafe-return": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-base-to-string": 0,
      "@typescript-eslint/no-redundant-type-constituents": 0,
      "@typescript-eslint/no-floating-promises": 0,
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        2,
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: true,
        },
      ],
    },
  },

  {
    files: ["packages/playground/**"],
    plugins: {
      tailwindcss: tailwindPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...tailwindPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-console": 0,
      "tailwindcss/classnames-order": 0,
      "tailwindcss/no-custom-classname": 0,
      "tailwindcss/enforces-negative-arbitrary-values": 2,
      "tailwindcss/no-contradicting-classname": 2,
      "tailwindcss/no-unnecessary-arbitrary-value": 0,
      "tailwindcss/migration-from-tailwind-2": 0,
    },
  }
);
