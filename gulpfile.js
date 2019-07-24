/* Imports */
const { series, parallel, watch } = require('gulp')

const {
  archive,
  assets,
  clean,
  config,
  css,
  htmlPanini,
  images,
  js,
  modeArg,
  paniniRefresh,
  serve,
 } = require('straws')

/* configuration */
const {
  ASSETS,
  CSS,
  HTML,
  IMAGES,
  JS,
  PATH,
} = config

const production = modeArg


/* Build */
const build = series(clean, parallel(assets, css, js, images, htmlPanini));

/* Watching */
const watcher = series(build, serve.init, () => {
    // assets
    watch(PATH.src + ASSETS.src, series(assets))
      .on("all", series(serve.reload));
    // css
    watch(PATH.src + CSS.src, series(css))
      .on("all", series(serve.reload));
    // html
    watch(PATH.src + HTML.src)
      .on("all", series(paniniRefresh, htmlPanini, serve.reload));
    // images
    watch(PATH.src + IMAGES.src, series(images))
      .on("all", series(serve.reload));
    // javascript
    watch(PATH.src + JS.src, series(js))
      .on("all", series(serve.reload));
  });

module.exports = {
  archive: archive,
  default: production ? series(build) : series(watcher),
  build: build
}