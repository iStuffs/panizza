'use strict';

/* Imports npm modules
   =================== */

// General
const gulp            = require('gulp');

// Panini templating
const panini          = require('panini');

// ENV & argumenst handeling
const gulpif          = require('gulp-if');
const args            = require('yargs').argv;

// Sass
const sass            = require('gulp-sass');
const cssMinification = require('gulp-clean-css');
const autoprefixer    = require('gulp-autoprefixer');
const sourcemaps      = require('gulp-sourcemaps');

// Error handeling
// const notify          = require("gulp-notify");

// browser refresh
const browser         = require('browser-sync');

// clear
const rm              = require('rimraf');

// Include scss library's paths
const path            = require('path');
const bourbon         = require("bourbon").includePaths;
const animate         = path.join(__dirname, 'node_modules/animate.css/source');
const normalize       = require("sassy-normalize").includePaths;
const reboot          = require("bootstrap-reboot-import").includePaths;


/* Paths Configuration
   =================== */

// App paths
const PATH = {
  src: 'src/',
  dist: './dist/',
};

// Panini paths
PATH.panini = {
  src:      PATH.src + 'pages/**/*.html',
  root:     PATH.src + 'pages/',
  layouts:  PATH.src + 'layouts/',
  partials: PATH.src + 'partials/',
  helpers:  PATH.src + 'helpers/',
  data:     PATH.src + 'data/',
}

// CSS paths
PATH.css = {
  src:      PATH.src  + 'assets/sass/**/*.{sass,scss}',
  dest:     PATH.dist + 'css/'
}

// JavaScript paths
PATH.js = {
  src:      PATH.src + 'assets/script/**/*.js',
  dest:     PATH.src + 'js/'
}


/* Panini templating
   ================= */

gulp.task('panini', function() {
  return gulp.src(PATH.panini.src)
    .pipe(panini({
      root:     PATH.panini.root,
      layouts:  PATH.panini.layouts,  // ${.html, .hbs, or .handlebars}
      partials: PATH.panini.partials, // *{.html, .hbs, or .handlebars}
      helpers:  PATH.panini.helpers,  // .js
      data:     PATH.panini.data      //JSON (.json) or YAML (.yml)
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('panini:refresh', function(done) {
  panini.refresh();
  done();
});


/* Css
   ==== */

gulp.task('cssTask', function () {
  return gulp.src(PATH.css.src)
  .pipe(gulpif(!args.production, sourcemaps.init()))
  .pipe(sass(
    { includePaths: [bourbon, animate, normalize, reboot] }
  ).on('error', sass.logError))
  .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
  }))
  .pipe(gulpif(!!args.production, cssMinification({compatibility: 'ie9'})))
  .pipe(gulpif(!args.production, sourcemaps.write('.')))
  .pipe(gulp.dest(PATH.css.dest));
});


/* Browser reload
   ============== */

gulp.task('refresh', () => {
    browser.init({
        server: {
            baseDir: './dist/',
        },
        port: '8080',
    });
});

/* Clear dist folder
   ================= */
gulp.task('cleanDist', (done) => {
    rm('./dist/', done);
});


/* Watching
   ======== */

gulp.task('watch', ['cssTask', 'panini', 'refresh'], function() {
    gulp.watch('./src/assets/sass/**/*.{sass, scss}', ['cssTask']);
    gulp.watch( 'src/{layouts,pages,partials,helpers,data}/**/*.{html,hbs,handlebars}', ['panini:refresh', 'panini']);
    gulp.watch('./dist/*.html').on('change', browser.reload);
    gulp.watch('./dist/css/*.css').on('change', browser.reload);
});


/* Cli & Default tasks
   =================== */

gulp.task('default', ['watch']);
gulp.task('clear', ['cleanDist']);
