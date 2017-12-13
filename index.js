var request = require("request");
var path = require("path");
var posix = require("path").posix;
var querystring = require("querystring");

var cssParser = require("./cssParser");
var fontDownloader = require("./fontDownloader");
var cssGenerator = require("./cssGenerator");

var allFormats = ["ttf", "eot", "woff", "woff2", "svg"];
var allStyles = [
  "100",       "300",       "400",       "700",       "900",
  "100italic", "300italic", "400italic", "700italic", "900italic",
];

function googWebFontDl(options) {
  if (typeof options === "string") options = { font: options };
  else if (options == null) options = {};

  if (options.font == null) {
    throw new Error("You need to give a font name as downloader('name') or downloader({ font: 'name' })");
  }

  if (options.prefix == null) {
    options.prefix = posix.join("..", "fonts", options.font);
  }

  if (options.destination == null) {
    options.destination = options.font;
  }
  options.destination = path.normalize(options.destination);

  var formats = options.formats;
  if (formats == null || formats === "all") {
    formats = allFormats;
  }

  if (formats.length === 0) {
    throw new Error("please select at least one format (or -a for all formats)");
  }

  for (var fmt of formats) {
    if (!cssParser.userAgentMap[fmt]) {
      throw new Error("Unknown format “" + fmt + "”");
    }
  }

  if (!options.styles) {
    options.styles = allStyles;
  }

  var url = "https://fonts.googleapis.com/css?family=" + querystring.escape(options.font) + ":" + options.styles;

  if (options.subset) {
    url += "&subset=" + querystring.escape(options.subset);
  }

  if (options.verbose) {
    console.log("Downloading webfont formats: “" + formats + "” to folder “" + options.destination + "”");
    console.log(url);
  }

  if (options.proxy) {
    request = request.defaults({"proxy": options.proxy});
  }

  var parsingResults = {
    cssObj: {},
    fontUrls: []
  };

  return cssParser(options, url, parsingResults).then(function() {
    return fontDownloader(options, parsingResults);
  }).then(function() {
    return cssGenerator(options, parsingResults);
  });
}

module.exports = googWebFontDl;
module.exports.default = googWebFontDl;  // ES6: import downloader from 'goog-webfont-dl'
module.exports.formats = allFormats;
module.exports.styles = allStyles;
