#!/usr/bin/env node

var commander = require("commander");
var request = require("request");
var css = require("css");
var async = require("async");
var fs = require("fs");
var path = require("path");

commander
  .version(require("./package.json").version)
  .option('-t, --ttf', 'Download TTF format')
  .option('-e, --eot', 'Download EOT format')
  .option('-w, --woff', 'Download WOFF format')
  .option('-s, --svg', 'Download SVG format')
  .option('-a, --all', 'Download all formats')
  .option('-f, --font [name]', 'Name of font')
  .option('-p, --prefix [prefix]', 'Prefix to use in CSS output', path.join("..", "fonts"))
  .option('-y, --styles [string]', 'Style string [e.g. 300,400,300italic,400italic]', '100,300,400,700,900,100italic,300italic,400italic,700italic,900italic')
  .parse(process.argv);

if (typeof commander.font === "undefined" || commander.font === null) {
  console.log("You need to give a font name");
  process.exit(1);
}

var formats = [];
if (commander.all) {
  formats = ["ttf", "eot", "woff", "svg"];
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
  if (commander.svg) {
    formats.push("svg");
  }
}

if (formats.length == 0) {
  console.log("please select at least one format (or -a for all formats)");
  process.exit(1);
}

var userAgentMap = {
  woff: "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36",
  eot:  "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
  svg:  "Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3",
  ttf:  "node.js"
};

var url = "http://fonts.googleapis.com/css?family=" + commander.font + ":" + commander.styles;
//console.log(url);

var fontUrls = [];
var cssObj = {};

var getFormatCSS = function(format, callback) {
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

    //console.log(body);

    var ast = css.parse(body);
    var rules = ast.stylesheet.rules;

    for (var i = 0; i < rules.length; i++) {
      var declarations = rules[i].declarations;

      var family = null
      var style = null;
      var weight = null;
      var urls = [];
      var localNames = [];

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

            regEx = /url\((\S+?)\)\s*format\('?(\S+?)'?\)/;
            match = regEx.exec(token);
            if (match !== null) {
              urls.push({url: match[1], format: match[2]});
              continue;
            }
          }
        }
      }

      if (urls.length > 0 && localNames.length > 0 && family !== null && style !== null && weight !== null) {
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

        var subObj = getSubObj(cssObj, [family, style, weight]);
        subObj.localNames = (!subObj.localNames ? localNames : subObj.localNames.concat(localNames));
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
          var ext = path.extname(url);
          var newFilename = defaultLocalName + ext;
          subObj.urls[urls[k].format] = path.join(commander.prefix, newFilename);

          fontUrls.push({url: url, name: newFilename});
        }
      }
    }

    callback();
  });
}

async.each(formats, getFormatCSS, function(err) {
  if (err) {
    console.log("Request error: " + err);
    process.exit(1);
  }

  //console.log(JSON.stringify(cssObj));
  //process.exit(0);

  var downloadFont = function(obj, callback) {
    var out = fs.createWriteStream(path.join(commander.font, obj.name));

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

      for(var family in cssObj) {
        var familyObj = cssObj[family];
        for (var style in familyObj) {
          var styleObj = familyObj[style];
          for (var weight in styleObj) {
            var weightObj = styleObj[weight];

            console.log("@font-face {");
            console.log("  font-family: '" + family + "';");
            console.log("  font-style: " + style + ";");
            console.log("  font-weight: " + weight + ";");

            // special handling for eot (ie 9)
            if (weightObj.urls["embedded-opentype"]) {
              console.log("  src: url(" + weightObj.urls["embedded-opentype"] + ");");
            }
            process.stdout.write("  src: ");

            var addComma = false;

            // local names
            for (var i = 0; i < weightObj.localNames.length; i++) {
              var localName = weightObj.localNames[i];

              if (addComma) {
                process.stdout.write(", ");
              }
              else {
                addComma = true;
              }
              process.stdout.write("local('" + localName + "')");
            }

            // url and formats
            for (var format in weightObj.urls) {
              var url = weightObj.urls[format];
              if (format === "embedded-opentype") {
                url += "?#iefix";
              }
              else if (format === "svg") {
                url += "#" + family;
              }

              if (addComma) {
                process.stdout.write(", ");
              }
              else {
                addComma = true;
              }
              process.stdout.write("url(" + url + ") format('" + format + "')");
            }

            console.log(";\n}\n");
          }
        }
      }

      process.exit(0);
    });
  };

  fs.exists(commander.font, function(exists) {
    if (!exists) {
      fs.mkdir(commander.font, function(err) {
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