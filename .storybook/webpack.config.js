module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      require.resolve("ts-loader"),
      env === "PRODUCTION" && require.resolve("react-docgen-typescript-loader")
    ].filter(Boolean)
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
