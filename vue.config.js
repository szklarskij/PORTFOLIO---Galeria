const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(4000000).maxAssetSize(400000);
  },
};
