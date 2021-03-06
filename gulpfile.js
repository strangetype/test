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

var exec = require('child_process').execFile;

var fs = require('fs-extra');

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
    gulp.watch(['app/**'], ['build', 'styles']);
});

gulp.task('styles', function () {
    console.log('build css');
    return sass('app/style/app.scss', {style: 'expanded'})
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('server', function () {
    var openServer = exec('D:/openserver/OpenServer/Open Server x64.exe');

    process.on('SIGINT', function() {
        openServer.kill();
        process.exit(2);
    });


    /*
     connect.server({
     port: 5000,
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
     */
});

gulp.task('export', function () {
    var exportData = [
        'index.html',
        //'./images',
        './build',
        './BE/actions',
        './fonts',
        './BE/library',
        './BE/index.php'
    ];

    var exportFolder = 'export/';

    function _emptyExportDir(cl) {
        fs.emptyDir('./export', function (err) {
            if (!err) {
                console.log('success!');
                if (typeof(cl)==='function') cl();
            }
        });
    }

    function _exportFiles(cl) {
        for (var i=0; i<exportData.length; i++) {
            try {
                fs.copySync(exportData[i], exportFolder+exportData[i], { replace: false });
                console.log("export "+exportData[i]+" success");
            } catch (err) {
                console.log("ERROR: export "+p+" failed");
                return;
            }
        }
        if (typeof(cl)==='function') cl();
    }

    function _removeLocalDB(cl) {
        fs.remove('./export/BE/library/DB.php', function (err) {
            if (err) {
                console.log("ERROR: delete DB.php failed");
            } else {
                console.log('export: delete DB.php: success!');
                if (typeof(cl)==='function') cl();
            }
        })
    }

    _emptyExportDir(function() {
        _exportFiles(function() {
            _removeLocalDB(function() {
                console.log("EXPORT DONE");
            });
        });
    });

});

gulp.task('default', ['server', 'build', 'styles', 'watch']);