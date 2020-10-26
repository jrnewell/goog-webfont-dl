var Promise = require("bluebird");
var request = require("request");
var css = require("css");
var posix = require("path").posix;
var _ = require("lodash");

var userAgentMap = {
  woff2: "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/40.0",
  woff: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
  eot:  "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
  svg:  "Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3",
  ttf:  "node.js"
};

function downloadCSS(format, url) {
  return new Promise(function(resolve, reject) {
    var opts = {
      url: url,
      headers: {
        "User-Agent": userAgentMap[format]
      }
    };

    request(opts, function(err, response, body) {
      if (err) {
        return reject(err);
      }
      else if (response.statusCode !== 200) {
        return reject(new Error("Bad response code: " + response.statusCode));
      }

      resolve(body);
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

function parseCSS(format, options, results, cssText) {
  var ast = css.parse(cssText);
  var rules = ast.stylesheet.rules;
  if (!_.isArray(rules)) {
    throw new Error("Problem parsing cssText");
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

          if (format !== "eot") {
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

    if (urls.length > 0 && subset !== null &&
        family !== null && style !== null && weight !== null)
    {
      var subObj = getSubObj(results.cssObj, [subset, family, style, weight]);
      if (!subObj.localNames) {
        subObj.localNames = [];
      }
      subObj.localNames = _.union(subObj.localNames, localNames);

      if (!subObj.defaultLocalName) {
        // some fonts do not have a local name provided - generate it from the font name
        if (localNames.length == 0) subObj.defaultLocalName = (family+"-"+style+"-"+weight).replace(/[\s]+/g, "-");
        else subObj.defaultLocalName = localNames[0].replace(/[\s]+/g, "-");
      }
      var defaultLocalName = subObj.defaultLocalName;

      // add urls
      if (!subObj.urls) {
        subObj.urls = {};
      }

      for (var u = 0; u < urls.length; u++) {
        var url = urls[u].url;
        var ext = posix.extname(url);
        var _format = urls[u].format;
        if (_.isEmpty(ext) && _format === "svg") {
          ext = ".svg";
        }
        var newFilename = (subset === "default" ? defaultLocalName + ext :
          defaultLocalName + "-" + subset + ext);
        subObj.urls[_format] = posix.join(options.prefix, newFilename);

        results.fontUrls.push({url: url, name: newFilename});
      }

      // add unicode range
      if (unicodeRange) {
        subObj.unicodeRange = unicodeRange;
      }
    }
    subset = null;
  }
}

function downloadAndParseCSS(options, url, parsingResults) {
  function parse(format, cssText) {
    return new Promise(function(resolve, reject) {
      try {
        parseCSS(format, options, parsingResults, cssText);
        resolve();
      }
      catch(err) {
        reject(err);
      }
    });
  }

  function downloadAndParse(format) {
    return downloadCSS(format, url).then(function(body) {
      return parse(format, body);
    });
  }

  return Promise.all(_.map(options.formats, downloadAndParse));
}

module.exports = downloadAndParseCSS;
module.exports.default = downloadAndParseCSS;
module.exports.userAgentMap = userAgentMap;
