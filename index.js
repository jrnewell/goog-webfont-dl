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
  .option('-a, --all', 'Download all formats', true)
  .option('-f, --font [name]', 'Name of font')
  .option('-y, --styles [string]', 'Style string [e.g. 300,400,300italic,400italic]', '100,300,400,700,900,100italic,300italic,400italic,700italic,900italic')
  .parse(process.argv);

if (typeof commander.font === "undefined" || commander.font === null) {
  console.log("You need to give a font name");
  process.exit(1);
}

var formatMap = {
  woff: "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36",
  eot: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
  svg: "Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3",
  ttf: "node.js"
};

var url = "http://fonts.googleapis.com/css?family=" + commander.font + ":" + commander.styles;
console.log(url);

var opts = {
  url: url,
  headers: {
    "User-Agent": formatMap.eot
  }
};

request(opts, function(err, response, body) {
  if (err) {
    console.log("Request error: " + err);
    process.exit(1);
  }
  else if (response.statusCode !== 200) {
    console.log("Bad response code: " + response.statusCode);
    process.exit(1);
  }

  var ast = css.parse(body);
  var rules = ast.stylesheet.rules;
  var fontUrls = [];

  for (var i = 0; i < rules.length; i++) {
    var declarations = rules[i].declarations;
    for (var j = 0; j < declarations.length; j++) {
      if (declarations[j].property === "src") {
        var regEx = /local\('(\S+?)'\)\s*,\s*url\((\S+?)\)/;
        var match = regEx.exec(declarations[j].value);
        if (match !== null) {
          var localName = match[1];
          var url = match[2];
          var ext = path.extname(url);
          localName += ext;

          console.log("localName: " + localName + ", url: " + url);
          fontUrls.push({url: url, name: localName});
          declarations[j].value = declarations[j].value.replace(url, path.join("..", "fonts", commander.font, localName));
          break;
        }
      }
    }
  }

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

      console.log(css.stringify(ast));
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