var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

var node_modules = path.resolve(__dirname, 'node_modules');

var config = require('./webpack.config.js');

gulp.task('build', function () {
  var compiler = webpack(config);
  compiler.run(function (err, stats) {
    if (err) {
      console.log('build fail:');
      console.log(err)
    } else if(stats.compilation.errors.length) {
      console.log(stats.compilation.errors)
    } else {
      console.log('build completed');
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(['app/**'], ['build']);
  gulp.watch('./assets/stylesheets/*.scss', ['styles']);
  gulp.watch('./assets/stylesheets/**/*.scss', ['styles']);
});

gulp.task('styles', function () {
  console.log('build css');
  return sass('app/style/**.scss', {style: 'expanded'})
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('build/css'));
});

gulp.task('server', function () {
  connect.server({
    port: 5000,
    //https://github.com/AveVlad/gulp-connect/issues/27
    //TODO: use plugin for proxy
    middleware: function (connect, o) {
      return [(function () {
        var url = require('url');
        var proxy = require('proxy-middleware');
        var options = url.parse('http://localhost:9999/api');
        options.route = '/api';
        return proxy(options);
      })()];
    }
  });
});

gulp.task('default', ['server', 'watch', 'build', 'styles']);

