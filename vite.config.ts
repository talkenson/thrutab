import * as path from 'path'
import { defineConfig } from 'vite'
import vitePluginDts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `thrutab.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'crypto'],
    },
  },
  plugins: [
    vitePluginDts({
      outputDir: './dist',
      insertTypesEntry: true,
    }),
  ],
})
