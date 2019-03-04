const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const panini = require('panini');
const args = require('yargs').argv;

/* Plugins */
// { autoprefixer, cleanCss, if, notify, plumber, sass, sourcemaps }
const $ = plugins();

/* configuration */
const { PATH, COMPATIBILITY } = require('./config.json');
const production = !!args.production;

/* panini templating */
gulp.task('panini', () => {
  return gulp.src(PATH.panini.src)
    .pipe(panini({
      root:     PATH.panini.root,
      layouts:  PATH.panini.layouts,  // ${.html, .hbs, or .handlebars}
      partials: PATH.panini.partials, // *{.html, .hbs, or .handlebars}
      helpers:  PATH.panini.helpers,  // .js
      data:     PATH.panini.data      //JSON (.json) or YAML (.yml)
    }))
    .pipe(gulp.dest(PATH.dest));
});

gulp.task('panini:refresh', (done) =>{
  panini.refresh();
  done();
});

/* CSS */
gulp.task('cssTask', () => {
  return gulp.src(PATH.css.src)
  .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
  .pipe($.if(!production, $.sourcemaps.init()))
  .pipe($.sassGlob())
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: COMPATIBILITY,
    cascade: false
  }))
  .pipe($.if(production, $.cleanCss({compatibility: 'ie11'})))
  .pipe($.if(!production, $.sourcemaps.write('.')))
  .pipe(gulp.dest(PATH.css.dest));
});

/* watching */
gulp.task('watch', gulp.series('cssTask', 'panini', () => {
  gulp.watch('PATH.css.src', gulp.series('cssTask'));
  gulp.watch('src/{layouts,partials,helpers,data}/**/*', gulp.series('panini:refresh', 'panini'));
}));

gulp.task('default', gulp.series('watch'));
