import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "es"
  },
  plugins: [
    typescript({
      exclude: ["**/__tests__/**/*", "cypress/**/*"],
      cacheRoot: ".rts2_cache" // default value. Explicitly set for .gitignore
    })
  ],
  external: ["react", "react-dom", "react-is", "resize-observer-polyfill"]
};
