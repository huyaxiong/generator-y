const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const postcssScss = require('postcss-scss');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const fontmin = require('gulp-fontmin');
const GulpSSH = require('gulp-ssh');
const fs = require('fs');
const clientDir = './';


function makeCss() {

    var scssSrc = clientDir + 'scss/main.scss',
        cssDest = clientDir + 'dist/';

    gulp.src(scssSrc)
        // .pipe(sourcemaps.init())
        .pipe(concat('app.scss'))
        .pipe(sass({
            // includePaths: ['node_modules/materialize-css/sass', 'node_modules/susy/sass', 'node_modules/foundation-sites/scss', 'node_modules/font-awesome/scss'],
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['last 10 versions']})
            // pxtorem({
            //     rootValue: 16,
            //     mediaQuery: true,
            //     propWhiteList: []
            // })
        ], {syntax: postcssScss}))
        // .pipe(sourcemaps.write(cssDest, {
        //     includeContent: false,
        //     sourceRoot: '../scss/'
        // })))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.reload({stream: true}));
}

function makeJs() {

    var jsSrc = [clientDir + 'js/**/*'],
        jsDest = clientDir + 'dist/';

    gulp.src(jsSrc)
        // .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({
            // mangle: false,
            // compress: {
            //     pure_funcs: ['console.log', 'window.console.log.apply']
            // }
        }))
        // .pipe(sourcemaps.write(jsDest))
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({stream: true}));
}

function makeImage() {

    gulp.src(clientDir + 'image/*')
        .pipe(imagemin())
        .pipe(gulp.dest(clientDir + 'image/dist'))
}

function makeFont() {

    gulp.src(clientDir + 'font/*')
        .pipe(fontmin({
            text: ''
        }))
        .pipe(gulp.dest(clientDir + 'font/dist'));
}

gulp.task('img' ,function () {

    makeImage();
});

gulp.task('font', function () {

    makeFont();
});

gulp.task('default', function () {

    browserSync.init({
        startPath: clientDir + 'index.html',
        server: {
            baseDir: './'
        }
    });

    gulp.watch([clientDir + 'js/**/*', clientDir + 'scss/*', clientDir + 'index.html'], function (event) {

        var filePath = event.path;
        if (filePath.lastIndexOf('.scss') !== -1) {
            makeCss();
        } else if (filePath.lastIndexOf('.js') !== -1) {
            makeJs();
        } else {
            browserSync.reload();
        }
    });
});


gulp.task('deploy', () => {

    var gulpSSH = new GulpSSH({
        sshConfig: {
            host: 'yaxiong.me',
            port: 22,
            username: 'root',
            privateKey: fs.readFileSync('/Users/Hugh/.ssh/id_rsa')
        }
    });

    return gulpSSH.shell([
        'cd /home/projects/',
        'git pull origin master',
        'pm2 startOrRestart pm2.json'
    ]).on('ssh2Data', (data) => {
        process.stdout.write(data.toString());
    });
});




