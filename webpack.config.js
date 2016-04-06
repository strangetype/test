
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var BowerWebpackPlugin = require('bower-webpack-plugin');


//'webpack/hot/dev-server',

var config = {
  context: path.join(__dirname, 'app'), // source directory
  entry: ['main'], // main.js file location
  output: {
    root: path.resolve(__dirname, 'app'),
    path: path.join(__dirname, 'build/js') // output directory
  },


  resolve: {
    root: path.resolve(__dirname, 'app'),
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [ "node_modules", "bower_components"],
  },

  module: {
    loaders: [
      { test: /\.jsx|\.js$/, loader: 'jsx-loader?harmony' },
      { test: /\.css$/, loader: "style-loader!css-loader" }
      , { test: /react-intl\.js$/ , loader: "imports?this=>window,intl,react!exports?ReactIntl" }

    ]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  plugins: [
    new BowerWebpackPlugin({
      modulesDirectories: ['bower_components'],
      manifestFiles: ['bower.json', '.bower.json'],
      includes: /.*/,
      excludes: /.*\.less$/
    })
  ]
};


module.exports =  config;
