const fs = require("fs");
const path = require("path");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const DEFAULT_OPTS = {
  disableDomDiff: true,
  enableEjs: true,
  syntaxHighlighting: true,
  lessTemplate: true,
  jsTemplate: true,
  cssTransform: true,
  mdLibrary: true,
  staticCopy: true,
  staticCnameCopy: true,
  defaultWatchers: true,
  addSitemap: true,
  addRobots: true,
  addSecurityTxt: true,
  robotsConf: {
    sitemap: true,
    entries: [ { useragents: [ "*" ], allow_urls: [ "/" ] } ]
  }
};

module.exports =
function config(eleventyConfig, givenOpts = {}) {
  const opts = {
    ...DEFAULT_OPTS,
    ...givenOpts
  };
  console.log(opts);

  if (opts.disableDomDiff) {
    // Prevent the server from trying to do a clever hot-reload when only
    // Markdown is changed. We have JavaScript code that needs to react to
    // changed content, so it's better to reload the page instead.
    eleventyConfig.setServerOptions({
      domDiff: false
    });
  }

  if (opts.enableEjs) {
    eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-ejs"));
  }

  if (opts.syntaxHighlighting) {
    eleventyConfig.addPlugin(syntaxHighlight, require("./plugins/prism.js"));
  }

  if (opts.lessTemplate) {
    eleventyConfig.addTemplateFormats("less");
    eleventyConfig.addExtension("less", require("./plugins/less.js"));
  }

  if (opts.jsTemplate) {
    eleventyConfig.addTemplateFormats("js");
    eleventyConfig.addExtension("js", require("./plugins/terser.js"));
  }

  if (opts.cssTransform) {
    eleventyConfig.addTransform("clean-css", require("./plugins/clean-css.js"));
  }

  if (opts.mdLibrary) {
    eleventyConfig.setLibrary("md", require("./plugins/markdown-it.js"));
  }

  if (opts.staticCopy) {
    eleventyConfig.addPassthroughCopy({ "static": "static" });
  }

  if (opts.staticCnameCopy) {
    eleventyConfig.addPassthroughCopy({ "static/CNAME": "CNAME" });
  }

  if (opts.defaultWatchers) {
    eleventyConfig.addWatchTarget("./less/");
    eleventyConfig.addWatchTarget("./layouts/");
  }

  if (opts.addSitemap) {
    eleventyConfig.addTemplate("sitemap.njk", fs.readFileSync(path.join(__dirname, "../templates/sitemap.njk"), { encoding: "utf8" }));
  }

  if (opts.addRobots) {
    eleventyConfig.addTemplate(
      "robots.njk",
      fs.readFileSync(path.join(__dirname, "../templates/robots.njk"), { encoding: "utf8" }),
      {
        robots: opts.robotsConf
      }
    );
  }

  if (opts.addSecurityTxt) {
    eleventyConfig.addPassthroughCopy({ `${path.join(__dirname, "../templates/security.txt"}`: ".well-known/security.txt" });
  }

  return;
}

module.exports.getMdLibrary =
function () {
  return require("./plugins/markdown-it.js");
};
