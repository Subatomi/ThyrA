module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@": "./src",
            "@/api": "./api",
            "assets": "./assets"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ],
  };
};
