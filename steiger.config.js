import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/pages/**'],
    rules: {
      'fsd/no-segmentless-slices': 'off',
      'fsd/forbidden-imports': 'off',//Forbidden import from higher layer "app".
    }
  },
  {
    files: ['./src/widgets/**'],
    rules: {
      'fsd/insignificant-slice': 'off', //This slice has only one reference in slice "widgets\word-list". Consider merging them.
    }
  },
  {
    files: ['./src/features/**'],
    rules: {
      'fsd/insignificant-slice': 'off', //This slice has only one reference in slice "widgets\word-list". Consider merging them.
      'fsd/segments-by-purpose': 'off',//This segment's name should describe the purpose of its contents, not what the contents are.
    }
  },
  {
    files: ['./src/entities/**'],
    rules: {
      'fsd/inconsistent-naming': 'off',
      'fsd/segments-by-purpose': 'off',//This segment's name should describe the purpose of its contents, not what the contents are.
    }
  },
  {
    files: ['./src/shared/theme-model/**'],
    rules: {
      'fsd/forbidden-imports': 'off',//Forbidden import from higher layer "app".
      'fsd/no-reserved-folder-names': 'off',//Having a folder with the name "ui" inside a segment could be confusing because that name is commonly used for segments. Consider renaming it.
    },
  },
])