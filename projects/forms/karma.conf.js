const defaultConfig = require('../../karma.conf.js');

module.exports = function (config) {
  const baseConfig = defaultConfig(config);

  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: require('path').join(__dirname, '../../coverage/forms'),
    },
  });
};
