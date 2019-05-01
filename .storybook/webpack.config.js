module.exports = (baseConfig, env) => {
  const config = baseConfig.config;
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
          transpileOnly: true,
          compilerOptions: {
            target: "es5"
          }
        }
      },
      env === "PRODUCTION" && require.resolve("react-docgen-typescript-loader")
    ].filter(Boolean)
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
