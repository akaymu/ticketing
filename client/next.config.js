// Bu sayede next watch edip değişiklikleri hemen
// browser'a yansıtır.
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
