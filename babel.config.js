module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            "@": ["./*"],
            "@app": ["./src/app"],
            "@pages": ["./src/pages"],
            "@widgets": ["./src/widgets"],
            "@features": ["./src/features"],
            "@entities": ["./src/entities"],
            "@shared": ["./src/shared"],
          },
        },
      ],
    ],
  };
};