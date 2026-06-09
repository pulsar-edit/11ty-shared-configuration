# 11ty-config

This repository contains the standard configuration of `11ty` for all Pulsar related websites that use it.

Such as:
* `pulsar-edit.dev` (WIP)
* `docs.pulsar-edit.dev`
* `blog.pulsar-edit.dev`

## Installation

It is recommended to use 11ty `v3.0.0` and above when using this package, as the following options require it:
* `enableEjs`
* `addSitemap`
* `addRobots`

## Usage

To use, simple add the following into your `eleventy.config.js` file:

```js
const pulsarEleventyConfig = require("11ty-config");

module.exports = (eleventyConfig) => {
  pulsarEleventyConfig(eleventyConfig, opts);
};
```

## Recommended Layout

Below is the recommended layout of any Pulsar repository that is using `11ty`.
This layout is recommended to ensure ease of switching between repos for contributors,
and in some instances the options and behavior of this module expect/rely on it.

* `/` (Repository Root)
  - `/data/default.js`: An `11ty` default data file. Can expose items such as:
    * `title`: The default page title.
    * `layout`: The default page layout.
    * `changefreq`: The default change frequency of pages used when building a `sitemap.xml`.
    * `url`: The default website URL.
  - `/layouts`: A collection of EJS layouts.
  - `/less`: Any custom LESS stylesheets. But it is recommended to import stylesheets from `https://docs.pulsar-edit.dev/main.css`.
  - `/static`: A collection of static files for the website.
    * `/static/CNAME`: The URL of the websites domain. Useful when using within GitHub Pages.
  - `/eleventy.config.js`: Of course your expected `11ty` config.
  - `/docs`: Directory of your websites docs.
    * `/docs/main.less`: A LESS stylesheet that's used to import styles from `/less`.
    * `/docs/main.js`: The websites JavaScript file.

## Options:

All options are enabled by default.

#### `disableDomDiff`

Sets:

```js
eleventyConfig.setServerOptions({
  domDiff: false
});
```

This prevents 11ty server from doing clever hot-reload when only Markdown content is changed.
Helpful if any code relies on a full page refresh to function.

#### `enableEjs`

Sets:

```js
eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-ejs"));
```

Preforms the setup of using EJS as a template file in 11ty `v3.0.0` and above as required.

#### `syntaxHighlighting`

Adds the `@11ty/eleventy-plugin-syntaxhighlighting` to 11ty's plugins, and configures Prism based configuration for additional language support.

Additional languages supported beyond Prism's default:
* `scm`

#### `lessTemplate`

Configures support for `.less` files.

#### `jsTemplate`

Configures support for minifying `.js` files.

#### `cssTransform`

Minifies CSS files.

#### `mdLibrary`

Configures our highly customized Markdown-IT instance to be used to process Markdown content.

If you'd like to build on top of our existing Markdown-IT instance, use the following instead:

```js
const pulsarEleventyConfig = require("11ty-config");

module.exports = (eleventyConfig) => {
  pulsarEleventyConfig(eleventyConfig, { mdLibrary: false });

  const md = pulsarEleventyConfig.getMdLibrary();

  // Customize `md` as needed

  eleventyConfig.setLibrary("md", md);
};
```

TODO: Add docs about what our Markdown-IT instance includes.

#### `staticCopy`

Sets:

```js
eleventyConfig.addPassthroughCopy({ "static": "static" });
```

Requires the existence of a `static` in the root of your project, and copies it's contents to `__dist/static`.

#### `staticCnameCopy`

Sets:

```js
eleventyConfig.addPassthroughCopy({ "static/CNAME": "CNAME" });
```

Moves a file located at your project roots `/static/CNAME` to `__dist/CNAME` as needed for configuring a custom subdomain in GitHub Pages.

#### `defaultWatchers`

Sets:

```js
eleventyConfig.addWatchTarget("./less/");
eleventyConfig.addWatchTarget("./layouts/");
```

Configures hot-reloading when changes occur in the expected directories.

#### `addSitemap`

Adds a `sitemap.xml` to the `__dist/sitemap.xml` that is built using the data from your pages.

Requires the following variables to be in your data cascade:
* `default.url`
* `default.changefreq`

And will use `page.changefreq` if in it's data cascade.

#### `addRobots`

Adds a `robots.txt` to the `__dist/robots.txt` that is built using the data from your pages.

Requires the following variables to be in your data cascade:
* `default.url`

Also expects that the sitemap will be used.

But can be further customized with `robotsConf` option.

#### `robotsConf`

This option controls what data is generated within the `robots.txt` if it is enabled by `addRobots`.
It will take a configuration object with the following top level properties:
* `sitemap`: A boolean to add the sitemap or exclude it. Requires `default.url` to be in your data cascade.
* `entries`: An array of objects that consist of each entry for a certain user-agent. Within each object:
  - `useragents`: An array of user-agents for this entry.
  - `allow_urls`: An optional array of URLs to allow under this user-agent.
  - `disallow_urls`: An optional array of URLs to disallow under this user-agent.

This configuration by default is:

```js
const robots = {
  sitemap: true,
  entries: [
    {
      useragents: [ "*" ],
      allow_urls: [ "/" ]
    }
  ]
};
```

If you provide your own, you will **override** the default, so must convey all data that should be included.
