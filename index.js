#!/usr/bin/env node

var commander = require("commander");
var request = require("request");
var css = require("css");
var async = require("async");
var fs = require("fs");
var path = require("path");
var posix = require("path").posix;
var querystring = require("querystring");
var mkdirp = require('mkdirp');
var _ = require("lodash");

commander
  .version(require("./package.json").version)
  .option('-t, --ttf', 'Download TTF format')
  .option('-e, --eot', 'Download EOT format')
  .option('-w, --woff', 'Download WOFF format')
  .option('-W, --woff2', 'Download WOFF2 format')
  .option('-s, --svg', 'Download SVG format')
  .option('-a, --all', 'Download all formats')
  .option('-f, --font [name]', 'Name of font')
  .option('-d, --destination [directory]', 'Save font in directory')
  .option('-o, --out [name]', 'CSS output file [use - for stdout]')
  .option('-p, --prefix [prefix]', 'Prefix to use in CSS output', posix.join("..", "fonts"))
  .option('-u, --subset [string]', 'Subset string [e.g. latin,cyrillic]')
  .option('-y, --styles [string]', 'Style string [e.g. 300,400,300italic,400italic]', '100,300,400,700,900,100italic,300italic,400italic,700italic,900italic')
  .option('-P, --proxy [string]', 'Proxy url [e.g. http://www.myproxy.com/]')

  .parse(process.argv);

if (typeof commander.font === "undefined" || commander.font === null) {
  console.log("You need to give a font name");
  process.exit(1);
}

if (typeof commander.destination === "undefined" || commander.destination === null) {
  commander.destination = commander.font;
}
commander.destination = path.normalize(commander.destination);

var formats = [];
if (commander.all) {
  formats = ["ttf", "eot", "woff", "woff2", "svg"];
}
else {
  if (commander.ttf) {
    formats.push("ttf");
  }
  if (commander.eot) {
    formats.push("eot");
  }
  if (commander.woff) {
    formats.push("woff");
  }
  if (commander.woff2) {
    formats.push("woff2");
  }
  if (commander.svg) {
    formats.push("svg");
  }
}

var cssOut, usingStdout, cssOutFile;
if (commander.out === "-") {
  usingStdout = true;
  cssOut = process.stdout;
}
else {
  usingStdout = false;
  cssOutFile = (commander.out ? path.normalize(commander.out) : (commander.font + ".css"));
  cssOut = fs.createWriteStream(cssOutFile);
}

if (formats.length == 0) {
  console.log("please select at least one format (or -a for all formats)");
  process.exit(1);
}

var userAgentMap = {
  woff2: "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36",
  woff: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
  eot:  "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
  svg:  "Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3",
  ttf:  "node.js"
};

var url = "http://fonts.googleapis.com/css?family=" + querystring.escape(commander.font) + ":" + commander.styles;

if (commander.subset) {
  url += "&subset=" + querystring.escape(commander.subset);
}

console.log("Downloading webfont formats: " + formats + " to folder " + commander.destination);
console.log(url);

var fontUrls = [];
var cssObj = {};

if (commander.proxy) {
  request = request.defaults({'proxy': commander.proxy});
}

var getFormatCSS = function(format, callback) {
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

      var family = null
      var style = null;
      var weight = null;
      var urls = [];
      var localNames = [];
      var unicodeRange = null;

      for (var j = 0; j < declarations.length; j++) {
        var declaration = declarations[j];
        if (declaration.property === "font-family") {
          family = declaration.value.replace(/['"]/g, '');

          if (family !== commander.font) {
            console.log("Warning: google returned a font-family [" + family + "] different than " + commander.font);
          }
        }
        else if (declaration.property === "font-style") {
          style = declaration.value.replace(/['"]/g, '');
        }
        else if (declaration.property === "font-weight") {
          weight = declaration.value.replace(/['"]/g, '');
        }
        else if (declaration.property === "src") {
          var tokens = declaration.value.split(",");

          for (var k = 0; k < tokens.length; k++) {
            var token = tokens[k].replace(/^\s+|[\s;]+$/, '');
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
                if (localNames.length == 0) {
                  localNames.push(family);
                }
                continue;
              }
            }
          }
        }
        else if (declaration.property === "unicode-range") {
          unicodeRange = declaration.value.replace(/['"]/g, '');
        }
      }

      if (urls.length > 0 && localNames.length > 0 && subset !== null &&
          family !== null && style !== null && weight !== null)
      {
        var getSubObj = function(obj, props) {
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
        };

        var subObj = getSubObj(cssObj, [subset, family, style, weight]);
        if (!subObj.localNames) {
          subObj.localNames = [];
        }
        subObj.localNames = _.union(subObj.localNames, localNames);

        if (!subObj.defaultLocalName) {
          subObj.defaultLocalName = localNames[0].replace(/[\s]+/g, '-');
        }
        var defaultLocalName = subObj.defaultLocalName;

        // add urls
        if (!subObj.urls) {
          subObj.urls = {};
        }

        for (var k = 0; k < urls.length; k++) {
          var url = urls[k].url;
          var ext = posix.extname(url);
          var format = urls[k].format;
          if (_.isEmpty(ext) && format === "svg") {
            ext = ".svg";
          }
          var newFilename = (subset === "default" ? defaultLocalName + ext :
            defaultLocalName + "-" + subset + ext);
          subObj.urls[format] = posix.join(commander.prefix, newFilename);

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

async.each(formats, getFormatCSS, function(err) {
  if (err) {
    console.log("Request error: " + err);
    process.exit(1);
  }

  var downloadFont = function(obj, callback) {
    var out = fs.createWriteStream(path.join(commander.destination, obj.name));

    out.on("error", function(err) {
      callback(err);
    });

    out.on("finish", function() {
      callback();
    });

    request(obj.url).pipe(out);
  };

  var doDownload = function() {
    async.each(fontUrls, downloadFont, function(err) {
      if (err) {
        console.log("Request error: " + err);
        process.exit(1);
      }

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

      if (!usingStdout) {
        console.log ("CSS output was successfully written to " + cssOutFile);

        cssOut.on("error", function(err) {
          console.log("write error: " + err);
          process.exit(1);
        });

        cssOut.on("finish", function(){
          process.exit(0);
        });

        cssOut.end();
      }
      else {
        process.exit(0);
      }
    });
  };

  fs.exists(commander.destination, function(exists) {
    if (!exists) {
      mkdirp(commander.destination, function(err) {
        if (err) {
          console.log("mkdir error: " + err);
          process.exit(1);
        }

        doDownload();
      });
    }
    else {
      doDownload();
    }
  });
});