var request = require("request");
var css = require("css");
var async = require("async");
var fs = require("fs");
var path = require("path");
var posix = require("path").posix;
var querystring = require("querystring");
var mkdirp = require("mkdirp");
var _ = require("lodash");

var allFormats = ["ttf", "eot", "woff", "woff2", "svg"];
var allStyles = [
  "100",       "300",       "400",       "700",       "900",
  "100italic", "300italic", "400italic", "700italic", "900italic",
];

function dl(options) {
  if (typeof options === "string") options = { font: options };
  else if (options == null) options = {};

  if (options.font == null) {
    throw new Error("You need to give a font name as dl('name') or dl({ font: 'name' })");
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

  var usingStdout = options.out === "-";

  if (formats.length === 0) {
    throw new Error("please select at least one format (or -a for all formats)");
  }

  var userAgentMap = {
    woff2: "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/40.0",
    woff: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    eot:  "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
    svg:  "Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3",
    ttf:  "node.js"
  };
  
  for (var fmt of formats) {
    if (!userAgentMap[fmt]) {
      throw new Error("Unknown format “" + fmt + "”");
    }
  }
  
  if (!options.styles) {
    options.styles = allStyles;
  }

  var url = "http://fonts.googleapis.com/css?family=" + querystring.escape(options.font) + ":" + options.styles;

  if (options.subset) {
    url += "&subset=" + querystring.escape(options.subset);
  }

  if (options.verbose) {
    console.log("Downloading webfont formats: “" + formats + "” to folder “" + options.destination + "”");
    console.log(url);
  }

  var fontUrls = [];
  var cssObj = {};

  if (options.proxy) {
    request = request.defaults({"proxy": options.proxy});
  }

  function getFormatCSS(format, callback) {
    var _format = format;
    var opts = {
      url: url,
      headers: {
        "User-Agent": userAgentMap[format]
      }
    };

    request(opts, function(err, response, body) {
      if (err) {
        return callback(err);
      }
      else if (response.statusCode !== 200) {
        return callback(new Error("Bad response code: " + response.statusCode));
      }

      var ast = css.parse(body);
      var rules = ast.stylesheet.rules;
      if (!_.isArray(rules)) {
        return callback(new Error("Problem parsing returned body"));
      }

      var subset = null;
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (_.isUndefined(rule.type)) {
          continue;
        }

        if (rule.type === "comment") {
          subset = rule.comment.trim();
          continue;
        }
        else if (subset === null) {
          subset = "default";
        }

        if (rules[i].type !== "font-face" || !_.isArray(rules[i].declarations)) {
          subset = null;
          continue;
        }
        var declarations = rules[i].declarations;

        var family = null;
        var style = null;
        var weight = null;
        var urls = [];
        var localNames = [];
        var unicodeRange = null;

        for (var j = 0; j < declarations.length; j++) {
          var declaration = declarations[j];
          if (declaration.property === "font-family") {
            family = declaration.value.replace(/['"]/g, "");

            if (family !== options.font) {
              console.warn("Warning: google returned a font-family [" + family + "] different than " + options.font);
            }
          }
          else if (declaration.property === "font-style") {
            style = declaration.value.replace(/['"]/g, "");
          }
          else if (declaration.property === "font-weight") {
            weight = declaration.value.replace(/['"]/g, "");
          }
          else if (declaration.property === "src") {
            var tokens = declaration.value.split(",");

            for (var k = 0; k < tokens.length; k++) {
              var token = tokens[k].replace(/^\s+|[\s;]+$/, "");
              var regEx = /local\('?(.+?)'?\)/g;
              var match = regEx.exec(token);
              if (match !== null) {
                localNames.push(match[1]);
                continue;
              }

              if (_format !== "eot") {
                regEx = /url\((\S+?)\)\s*format\('?(\S+?)'?\)/;
                match = regEx.exec(token);
                if (match !== null) {
                  urls.push({url: match[1], format: match[2]});
                  continue;
                }
              }
              else {
                regEx = /url\((\S+?)\)/;
                match = regEx.exec(token);
                if (match !== null) {
                  urls.push({url: match[1], format: "embedded-opentype"});
                  if (localNames.length === 0) {
                    localNames.push(family);
                  }
                  continue;
                }
              }
            }
          }
          else if (declaration.property === "unicode-range") {
            unicodeRange = declaration.value.replace(/['"]/g, "");
          }
        }

        if (urls.length > 0 && localNames.length > 0 && subset !== null &&
            family !== null && style !== null && weight !== null)
        {
          var subObj = getSubObj(cssObj, [subset, family, style, weight]);
          if (!subObj.localNames) {
            subObj.localNames = [];
          }
          subObj.localNames = _.union(subObj.localNames, localNames);

          if (!subObj.defaultLocalName) {
            subObj.defaultLocalName = localNames[0].replace(/[\s]+/g, "-");
          }
          var defaultLocalName = subObj.defaultLocalName;

          // add urls
          if (!subObj.urls) {
            subObj.urls = {};
          }

          for (var u = 0; u < urls.length; u++) {
            var url = urls[u].url;
            var ext = posix.extname(url);
            var format = urls[u].format;
            if (_.isEmpty(ext) && format === "svg") {
              ext = ".svg";
            }
            var newFilename = (subset === "default" ? defaultLocalName + ext :
              defaultLocalName + "-" + subset + ext);
            subObj.urls[format] = posix.join(options.prefix, newFilename);

            fontUrls.push({url: url, name: newFilename});
          }

          // add unicode range
          if (unicodeRange) {
            subObj.unicodeRange = unicodeRange;
          }
        }
        subset = null;
      }

      callback();
    });
  }

  return new Promise(function(resolve, reject) {
    async.each(formats, getFormatCSS, function(err) {
      if (err) {
        return reject(new Error("Request error: " + err));
      }

      mkdirp(options.destination, function(err) {
        if (err) {
          throw new Error("mkdir error: " + err);
        }

        doDownload(fontUrls, usingStdout, cssObj, options.out, options.destination, options.verbose)
          .then(resolve);
      });
    });
  });
}

function getSubObj(obj, props) {
  var curr = obj;
  for(var i = 0; i < props.length; i++) {
    var prop = props[i];
    var subObj = curr[prop];
    if (!subObj) {
      subObj = {};
      curr[prop] = subObj;
    }
    curr = subObj;
  }
  return curr;
}

function FakeFile() {
  this.s = "";
}
FakeFile.prototype.write = function(s) {
  this.s += s;
};
FakeFile.prototype.toString = function() {
  return this.s;
};

function getFile(outFile) {
  if (outFile === "-") {
    return process.stdout;
  } else if (outFile == null) {
    return new FakeFile();
  } else if (outFile instanceof Buffer) {
    return outFile;
  } else if (typeof outFile === "string") {
    return fs.createWriteStream(path.normalize(outFile));
  } else {
    throw new Error("options.out is of unknown type");
  }
}

function doDownload(fontUrls, usingStdout, cssObj, cssOutFile, destination, verbose) {
  function downloadFont(obj, callback) {
    var out = fs.createWriteStream(path.join(destination, obj.name));

    out.on("error", function(err) {
      callback(err);
    });

    out.on("finish", function() {
      callback();
    });

    request(obj.url).pipe(out);
  }

  return new Promise(function(resolve, reject) {
    async.each(fontUrls, downloadFont, function(err) {
      if (err) {
        return reject(new Error("Request error: " + err));
      }
      
      // defer this until here so no CSS is created if an error occurred. 
      var cssOut = getFile(cssOutFile);

      // write out css with new file names
      for(var subset in cssObj) {
        var subsetObj = cssObj[subset];
        for(var family in subsetObj) {
          var familyObj = subsetObj[family];
          for (var style in familyObj) {
            var styleObj = familyObj[style];
            for (var weight in styleObj) {
              var weightObj = styleObj[weight];

              if (subset !== "default") {
                cssOut.write("/* " + subset + " */\n");
              }

              cssOut.write("@font-face {\n");
              cssOut.write("  font-family: '" + family + "';\n");
              cssOut.write("  font-style: " + style + ";\n");
              cssOut.write("  font-weight: " + weight + ";\n");

              // special handling for eot (ie 9)
              if (weightObj.urls["embedded-opentype"]) {
                cssOut.write("  src: url(" + weightObj.urls["embedded-opentype"] + ");\n");
              }
              cssOut.write("  src: ");

              var addComma = false;

              // local names
              for (var i = 0; i < weightObj.localNames.length; i++) {
                var localName = weightObj.localNames[i];

                if (addComma) {
                  cssOut.write(", ");
                }
                else {
                  addComma = true;
                }
                cssOut.write("local('" + localName + "')");
              }

              // url and formats
              for (var format in weightObj.urls) {
                var url = weightObj.urls[format];
                if (format === "embedded-opentype") {
                  url += "?#iefix";
                }
                else if (format === "svg") {
                  url += "#" + family.replace(/\s+/g, "");
                }

                if (addComma) {
                  cssOut.write(", ");
                }
                else {
                  addComma = true;
                }
                cssOut.write("url(" + url + ") format('" + format + "')");
              }
              cssOut.write(";\n");

              if (weightObj.unicodeRange) {
                cssOut.write("  unicode-range: " + weightObj.unicodeRange + ";\n");
              }

              cssOut.write("}\n\n");
            }
          }
        }
      }

      if (!usingStdout && typeof cssOutFile === "string") {
        if (verbose) {
          console.log("CSS output was successfully written to “" + cssOutFile + "”");
        }
        
        cssOut.on("error", function(err) {
          return reject(new Error("write error: " + err));
        });

        cssOut.end();
      }
      
      resolve((cssOutFile == null) ? cssOut.toString() : null);
    });
  });
}

module.exports = dl;
module.exports.default = dl;  // ES6: import downloader from 'goog-webfont-dl'
module.exports.formats = allFormats;
module.exports.styles = allStyles;
