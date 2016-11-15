var Promise = require("bluebird");
var fs = require("fs");
var path = require("path");

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
  }
  else if (outFile == null) {
    return new FakeFile();
  }
  else if (outFile instanceof Buffer) {
    return outFile;
  }
  else if (typeof outFile === "string") {
    return fs.createWriteStream(path.normalize(outFile));
  }
  else {
    throw new Error("options.out is of unknown type");
  }
}

function generateCSS(options, parsingResults) {
  return new Promise(function(resolve, reject) {
    var usingStdout = options.out === "-";
    var cssOutFile = options.out;
    var cssObj = parsingResults.cssObj;

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
      if (options.verbose) {
        console.log("CSS output was successfully written to “" + cssOutFile + "”");
      }

      cssOut.on("error", function(err) {
        reject(new Error("write error: " + err));
      });

      cssOut.on("finish", function() {
        resolve();
      });

      cssOut.end();
    }
    else {
      resolve((cssOutFile == null) ? cssOut.toString() : null);
    }
  });
}

module.exports = generateCSS;
module.exports.default = generateCSS;
