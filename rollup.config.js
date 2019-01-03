import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy-glob";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "es"
  },
  plugins: [
    typescript({
      cacheRoot: ".rts2_cache" // default value. Explicitly set for .gitignore
    }),
    copy([{ files: "src/*.css", dest: "dist" }])
  ],
  external: ["react", "react-dom", "resize-observer-polyfill"]
};
