const webpack = require('webpack');

module.exports = function override(config) {
  // Add buffer fallback
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
  };

  // Add buffer plugin
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
