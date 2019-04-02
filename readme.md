# Futhark:builder
![](docs/images/futhark-builder-logo.png)

Futhark buider is a template for starting your projects.


## How to install

```shell
git clone https://github.com/iStuffs/panizza.git my-project
```


## What you get

-   [Panini](https://foundation.zurb.com/sites/docs/panini.html) templating (based on [handelbars](https://handlebarsjs.com/) with yaml front matter)
-   Developpement server with auto reload (powered by [Browser sync](https://www.browsersync.io/))
-   [Gulp](https://gulpjs.com/) automation
    -   for compiling html templates
    -   for html minification
    -   for javascript bundeling and minification
    -   for sass compilation and minification
-   gulp config file to easy config at your needs
-   directory tructure organisation

## How to use it

Start dev serveur and watch files
```shell
npm start
```

Build assets for production
```shell
npm run build
```