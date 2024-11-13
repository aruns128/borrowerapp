const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Merge the default config with the reanimated configuration
const config = mergeConfig(
  defaultConfig,
  wrapWithReanimatedMetroConfig(defaultConfig),
);

// Export the final merged config
module.exports = config;
