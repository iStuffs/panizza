/* Imports */
const args = require("yargs").argv;
const browserSync = require("browser-sync");
const eyeglass = require("eyeglass");
const gulp = require("gulp");
const named = require("vinyl-named");
const panini = require("panini");
const plugins = require("gulp-load-plugins");
const rm = require("rimraf");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");

/* Plugins */
// { autoprefixer, cleanCss, if, notify, plumber, sass, sourcemaps, uglify }
const $ = plugins();

/* configuration */
const {
  ASSETS,
  COMPATIBILITY,
  CSS,
  ERROR,
  HTML,
  IMAGES,
  JS,
  PATH,
  SERVER
} = require("./config.json");
const production = !!args.production;

/* helper functions */
function clean(done) {
  rm(PATH.dest, done);
}

/* HTML */
function html() {
  return gulp
    .src(PATH.src + HTML.entries)
    .pipe(panini(HTML.paniniOptions))
    .pipe(gulp.dest(PATH.dest + HTML.dest));
}

function paniniRefresh(done) {
  panini.refresh();
  done();
}

/* CSS */
function css() {
  return gulp
    .src(PATH.src + CSS.src)
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError(ERROR)
      })
    )
    .pipe($.if(!production, $.sourcemaps.init()))
    .pipe($.sassGlob())
    .pipe($.sass(eyeglass()).on("error", $.sass.logError))
    .pipe(
      $.autoprefixer({
        browsers: COMPATIBILITY,
        cascade: false
      })
    )
    .pipe($.if(production, $.cleanCss({ compatibility: "ie11" })))
    .pipe($.if(!production, $.sourcemaps.write(".")))
    .pipe(gulp.dest(PATH.dest + CSS.dest));
}

/* JS */
const webpackConfig = {
  mode: production ? "production" : "development",
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              compact: false
            }
          }
        ]
      }
    ]
  },
  devtool: !production && "source-map"
};

function js() {
  return gulp
    .src(PATH.src + JS.entries)
    .pipe(named())
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError(ERROR)
      })
    )
    .pipe($.if(!production, $.sourcemaps.init()))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe($.if(production, $.uglify()))
    .pipe($.if(!production, $.sourcemaps.write(".")))
    .pipe(gulp.dest(PATH.dest + JS.dest));
}

/* ASSETS - json and fonts*/
function images() {
  return gulp
    .src(PATH.src + IMAGES.src)
    .pipe($.imagemin())
    .pipe(gulp.dest(PATH.dest + IMAGES.dest));
}

/* ASSETS - json and fonts*/
function copy() {
  return gulp
    .src(PATH.src + ASSETS.src)

    .pipe(gulp.dest(PATH.dest + ASSETS.dest)); // JSON (.json) and fonts (*.{eot,otf,svg,ttf,woff,woff2})
}

function browserReload(done) {
  browserSync.reload();
  done();
}

/* Build */
gulp.task(
  "build",
  gulp.series(clean, copy, css, js, images, html));

/* Serve */
gulp.task("serve", done => {
  browserSync.init({
    server: {
      baseDir: SERVER.root
    },
    port: SERVER.port
  });
  done();
});

/* Watching */
gulp.task(
  "watch",
  gulp.series("build", "serve", () => {
    // watch files
    gulp
      .watch(PATH.src + IMAGES.src, gulp.series(images))
      .on("all", gulp.series(browserReload));
    gulp
      .watch(PATH.src + JS.src, gulp.series(js))
      .on("all", gulp.series(browserReload));
    gulp
      .watch(PATH.src + CSS.src, gulp.series(css))
      .on("all", gulp.series(browserReload));
    gulp
      .watch(PATH.src + ASSETS.src, gulp.series(copy))
      .on("all", gulp.series(browserReload));
    gulp
      .watch(PATH.src + HTML.src)
      .on("all", gulp.series(paniniRefresh, html, browserReload));
  })
);

/* Default Task */
gulp.task("default", production ? gulp.series("build") : gulp.series("watch"));
