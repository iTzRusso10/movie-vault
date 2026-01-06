import { tanstackConfig } from "@tanstack/eslint-config";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import tailwindPlugin from "eslint-plugin-better-tailwindcss";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import zodPlugin from "./eslint-plugin-zod.mjs";

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  ...tanstackConfig,
  {
    name: "js/ts",
    settings: { react: { version: "detect" } },
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      "no-shadow": 0,
      "import/order": 2,
      "no-constant-condition": 0,
      "no-restricted-globals": [
        2,
        { name: "process", message: "Use 'env.****' instead" },
        { name: "open", message: "Don't do that" },
        { name: "close", message: "Don't do that" },
        { name: "location", message: "Don't do that" },
        { name: "alert", message: "Don't do that" },
      ],
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/naming-convention": 0,
      "@typescript-eslint/no-namespace": 0,
      "@typescript-eslint/no-unnecessary-condition": 2,
      "@typescript-eslint/no-floating-promises": 2,
      "@typescript-eslint/no-misused-promises": 2,
      "@typescript-eslint/prefer-promise-reject-errors": [
        2,
        { allowThrowingAny: true, allowThrowingUnknown: true },
      ],
      "@typescript-eslint/require-await": 0,
      "@typescript-eslint/restrict-template-expressions": [
        2,
        { allowArray: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    name: "jsx-a11y",
    files: ["**/*.{js,ts,tsx}"],
    plugins: { "jsx-a11y": jsxA11yPlugin },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": 1,
      "jsx-a11y/click-events-have-key-events": 0,
      "jsx-a11y/no-static-element-interactions": 0,
      "jsx-a11y/no-noninteractive-element-interactions": 0,
      "jsx-a11y/no-autofocus": 0,
    },
  },
  {
    name: "zod",
    plugins: { zod: zodPlugin },
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      "zod/enforce-namespace-import": 2,
    },
  },
  {
    name: "tailwind",
    plugins: { "better-tailwind": tailwindPlugin },
    files: ["**/*.{js,ts,tsx}"],
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/styles/index.css",
        callees: ["clsx", "cn", "cns", "twMerge", "cva"],
        detectComponentClasses: true,
      },
    },
    rules: {
      "better-tailwind/enforce-consistent-important-position": 2,
      "better-tailwind/enforce-consistent-variable-syntax": 2,
      "better-tailwind/no-conflicting-classes": 2,
      "better-tailwind/no-duplicate-classes": 2,
      "better-tailwind/no-unregistered-classes": 2,
    },
  },
  {
    name: "tanstack-query",
    plugins: { "@tanstack/query": tanstackQueryPlugin },
    rules: {
      ...tanstackQueryPlugin.configs.recommended.rules,
      "@tanstack/query/exhaustive-deps": 2,
      "@tanstack/query/infinite-query-property-order": 2,
      "@tanstack/query/no-rest-destructuring": 1,
      "@tanstack/query/no-unstable-deps": 2,
      "@tanstack/query/stable-query-client": 2,
    },
  },
  {
    name: "react",
    plugins: { "react-hooks": reactHooksPlugin, react: reactPlugin },
    files: ["**/*.{js,ts,tsx}"],
    settings: {
      "react-hooks": {
        additionalEffectHooks: "(useUpdateEffect|useIsomorphicLayoutEffect)",
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooksPlugin.configs["recommended-latest"].rules,
      "react/display-name": 0,
      "react/jsx-no-leaked-render": 1,
      "react/no-children-prop": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "react-hooks/refs": 0,
      "react-hooks/immutability": 0,
      "react-hooks/set-state-in-effect": 0,
      "react-hooks/rules-of-hooks": 2,
      "react-hooks/static-components": 2,
      "react-hooks/use-memo": 2,
      "react-hooks/memoized-effect-dependencies": 2,
      "react-hooks/no-deriving-state-in-effects": 2,
      "react-hooks/set-state-in-render": 2,
      "react-hooks/purity": 2,
      "react-hooks/exhaustive-deps": [
        2,
        { additionalHooks: "(useUpdateEffect|useIsomorphicLayoutEffect)" },
      ],
    },
  },
  {
    name: "scripts",
    files: ["scripts/**/*.{js,ts,tsx}"],
    rules: {
      "no-restricted-globals": 0,
    },
  },
];

export default config;
