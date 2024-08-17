import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: {
        properties: {
          regex: /^[_#]/,
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
  plugins: [ViteMinifyPlugin({})],
});
