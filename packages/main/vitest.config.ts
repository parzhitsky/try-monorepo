import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@@shared\/(.*)$/,
        replacement: resolve(__dirname, '..', 'shared/dist/src/$1'),
      },
      {
        find: /^@\/(.*)$/,
        replacement: resolve(__dirname, 'src/$1'),
      },
    ],
  },
  test: {
    root: __dirname,
    globals: true,
    mockReset: true,
  },
})
