const gulp            = require('gulp');
const panini          = require('panini');
const gulpif          = require('gulp-if');
const sass            = require('gulp-sass');
const cssMinification = require('gulp-clean-css');
const args            = require('yargs').argv;
const autoprefixer    = require('gulp-autoprefixer');
const notify          = require("gulp-notify");
const sourcemaps      = require('gulp-sourcemaps');

/* configuration */
const PATH = {
  src: 'src/',
  dist: './dist/',
};

PATH.panini = {
  src:      PATH.src + 'pages/**/*.html',
  root:     PATH.src + 'pages/',
  layouts:  PATH.src + 'layouts/',
  partials: PATH.src + 'partials/',
  helpers:  PATH.src + 'helpers/',
  data:     PATH.src + 'data/',
}

PATH.css = {
  src:      PATH.src  + 'assets/sass/**/*.{sass,scss}',
  dest:     PATH.dist + 'css/'
}

PATH.js = {
  src:      PATH.src + 'assets/script/**/*.js',
  dest:     PATH.src + 'js/'
}

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
    .pipe(gulp.dest('dist'));
});


gulp.task('panini:refresh', (done) =>{
  panini.refresh();
  done();
});

/* CSS */
gulp.task('cssTask', () => {
  return gulp.src(PATH.css.src)
  .pipe(gulpif(!args.production, sourcemaps.init()))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
  }))
  .pipe(gulpif(!!args.production, cssMinification({compatibility: 'ie9'})))
  .pipe(gulpif(!args.production, sourcemaps.write('.')))
  // .pipe(gulp.dest(PATH.css.dist));
  .pipe(gulp.dest('./dist/css/'));
});

/* watching */

gulp.task('watch', gulp.series('cssTask', 'panini', () => {
  gulp.watch('./src/assets/sass/**/*.{sass,scss}', gulp.series('cssTask'));
  gulp.watch('src/{layouts,partials,helpers,data}/**/*', gulp.series('panini:refresh', 'panini'));
}));

gulp.task('default', gulp.series('watch'));
