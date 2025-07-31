const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: [
      // Image formats
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg',
      // Video formats
      'mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v',
      // Audio formats
      'mp3', 'wav', 'aac', 'ogg', 'm4a',
      // Document formats
      'pdf', 'doc', 'docx',
      // Other formats
      'json', 'txt', 'xml'
    ],
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);