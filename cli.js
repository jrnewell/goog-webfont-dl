#!/usr/bin/env node

var commander = require("commander");
var downloader = require(".");

commander
  .version(require("./package.json").version)
  .usage("[options] <fontname>")
  .option("-t, --ttf", "Download TTF format")
  .option("-e, --eot", "Download EOT format")
  .option("-w, --woff", "Download WOFF format")
  .option("-W, --woff2", "Download WOFF2 format")
  .option("-s, --svg", "Download SVG format")
  .option("-a, --all", "Download all formats")
  .option("-f, --font [name]", "Name of font")
  .option("-d, --destination [directory]", "Save font in directory")
  .option("-o, --out [name]", "CSS output file [use - for stdout]")
  .option("-p, --prefix [prefix]", "Prefix to use in CSS output")
  .option("-u, --subset [string]", "Subset string [e.g. latin,cyrillic]")
  .option("-y, --styles [string]", "Style string [e.g. 300,400,300italic,400italic]")
  .option("-P, --proxy [string]", "Proxy url [e.g. http://www.myproxy.com/]")
  .option("-q, --quiet", "Do not print status information")

  .parse(process.argv);

// validate font
if (!commander.font) {
  if (commander.args.length === 1) {
    commander.font = commander.args[0];
  }
  else {
    console.error("You need to give a (single) font name");
    process.exit(1);
  }
}
delete commander.args;

// validate and prepare formats
commander.formats = (commander.all)
  ? downloader.formats
  : downloader.formats.filter(function(f) { return !!commander[f]; });

if (commander.formats.length === 0) {
  console.error("please select at least one format (or -a for all formats)");
  process.exit(1);
}

for (var f of downloader.formats) {
  delete commander[f];
}

// in case a font combined with + instead of spaces was given
var plusRegEx = new RegExp('\\+', 'g');
if (plusRegEx.test(commander.font)) {
  commander.font = commander.font.replace(plusRegEx, ' ');
}

// set CSS file
if (!commander.out) {
  commander.out = commander.font + ".css";
}

// transform quiet → verbose. CLI is verbose per default, library is quiet
commander.verbose = !commander.quiet;
delete commander.quiet;

downloader(commander).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});
