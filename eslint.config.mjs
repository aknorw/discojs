import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['dist/', 'docs/', 'lib/'],
  },
  ...fixupConfigRules(compat.extends('plugin:@typescript-eslint/recommended', 'prettier')),
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts'],
    plugins: {},
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  },
]
