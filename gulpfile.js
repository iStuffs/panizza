var gulp   = require('gulp');
var panini = require('panini');

/* configuration */
var PATH = {
  src: 'src/',
};

PATH.panini = {
  src:      PATH.src + 'pages/**/*.html',
  root:     PATH.src + 'pages/',
  layouts:  PATH.src + 'root/layouts/',
  partials: PATH.src + 'root/partials/',
  helpers:  PATH.src + 'root/helpers/',
  data:     PATH.src + 'root/data/',
}

PATH.css = {
  src:      PATH.src + 'assets/sass/**/*.html',
  data:     PATH.src + 'root/data/',
}

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


gulp.task('watch', ['panini'], function() {
  gulp.watch( 'src/{layouts,partials,helpers,data}/**/*',
  ['panini:refresh', 'panini']
);
});

gulp.task('default', ['watch']);
