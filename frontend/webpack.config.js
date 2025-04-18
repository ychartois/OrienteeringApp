const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
      }
    },
    argv
  );

  // Add this - Set the public path for GitHub Pages
  config.output.publicPath = '/OrienteeringApp/';

  // Add this - Ensure assets are properly handled
  const assetRule = config.module.rules.find(rule => 
    rule.oneOf && rule.oneOf.some(oneOf => 
      oneOf.loader && oneOf.loader.includes('file-loader')
    )
  );
  
  if (assetRule && assetRule.oneOf) {
    const fileLoaderRule = assetRule.oneOf.find(oneOf => 
      oneOf.loader && oneOf.loader.includes('file-loader')
    );
    
    if (fileLoaderRule) {
      fileLoaderRule.options.name = 'static/media/[name].[hash:8].[ext]';
    }
  }

  return config;
};
