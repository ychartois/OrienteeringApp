module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.web.js',
          '.js',
          '.ios.ts',
          '.android.ts',
          '.web.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.web.tsx',
          '.tsx',
          '.json',
        ],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
  // No special env configuration needed
};
