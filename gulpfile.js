/* Imports */
const { series, parallel, watch } = require('gulp')

const {
  archive,
  assets,
  clean,
  config,
  css,
  panini,
  images,
  js,
  modeArg,
  serve,
 } = require('straws')

/* configuration */
const {
  ASSETS,
  CSS,
  IMAGES,
  JS,
  PANINI,
  PATH,
} = config

const production = modeArg


/* Build */
const build = series(clean, parallel(assets, css, js, images, panini.html));

/* Watching */
const watcher = series(build, serve.init, () => {
    // assets
    watch(PATH.src + ASSETS.src, series(assets))
      .on("all", series(serve.reload));
    // css
    watch(PATH.src + CSS.src, series(css))
      .on("all", series(serve.reload));
    // html
    watch(PATH.src + PANINI.src)
      .on("all", series(panini.refresh, panini.html, serve.reload));
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