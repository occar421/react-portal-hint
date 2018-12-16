import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "es"
  },
  plugins: [
    typescript({
      cacheRoot: ".rts2_cache" // default value. Explicitly set for .gitignore
    })
  ],
  external: ["react"]
};
