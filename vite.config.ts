import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { checker } from "vite-plugin-checker";

export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [
    checker({
      typescript: true,
      overlay: false,
    }),
    ViteMinifyPlugin({}),
  ],
  server: {
    watch: {
      // use only with WSL
      usePolling: true,
    },
  },
});
