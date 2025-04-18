const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');

// Get the repository name from package.json or environment variable
const repoName = process.env.REPO_NAME || 'OrienteeringApp';
const isProduction = process.env.NODE_ENV === 'production';

// Check if src/assets directory exists and has files
const assetsDir = path.resolve(__dirname, 'src/assets');
const hasAssets = fs.existsSync(assetsDir) && 
                 fs.readdirSync(assetsDir).length > 0;

// Plugin configuration
const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'public', 'index.html'),
  })
];

// Only add CopyWebpackPlugin if assets directory has files
if (hasAssets) {
  plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'src/assets'),
          to: 'assets'
        },
      ],
    })
  );
}

// Add a global variable for asset path prefix to be used in the application
if (isProduction) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(`/${repoName}/`)
    })
  );
} else {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify('/')
    })
  );
}

// Add this plugin to copy static files
plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      { 
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist'),
        globOptions: {
          ignore: ['**/index.html'], // Don't copy index.html as HtmlWebpackPlugin handles it
        },
      },
    ],
  })
);

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // For GitHub Pages deployment, use the repository name as the base path in production
    publicPath: isProduction ? `/${repoName}/` : '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-vector-icons|@react-native\/assets-registry)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      // More specific alias to catch the import from react-native-paper
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/utils/MaterialCommunityIcons.js'),
      'react-native-vector-icons': 'react-native-vector-icons/dist',
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      // Add alias for the assets directory
      'assets': path.resolve(__dirname, '../assets'),
    },
  },
  plugins: plugins,
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
      // Serve assets from root level during transition
      {
        directory: path.join(__dirname, '..', 'assets'),
        publicPath: '/assets',
      },
      // Serve assets from frontend/src/assets for new location
      {
        directory: path.join(__dirname, 'src', 'assets'),
        publicPath: '/assets',
      }
    ],
    historyApiFallback: true,
    compress: true,
    port: 3000,
    hot: true,
    open: true,
  },
};