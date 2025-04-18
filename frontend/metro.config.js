const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

module.exports = (async () => {
  // Get the default Expo config
  const expoConfig = await getDefaultConfig(__dirname);
  
  // Define the path to the assets directory
  const assetsDir = path.resolve(__dirname, 'src/assets');
  
  // Customize for SVG support and asset handling
  const customConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: expoConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...expoConfig.resolver.sourceExts, 'svg'],
    },
    // Add project root detection to handle assets more flexibly
    projectRoot: __dirname,
    watchFolders: [assetsDir],
  };

  // Merge configs
  return mergeConfig(expoConfig, customConfig);
})();
