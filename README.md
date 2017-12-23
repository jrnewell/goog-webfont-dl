# Google WebFont Downloader

[![NPM version](http://img.shields.io/npm/v/goog-webfont-dl.svg)](https://www.npmjs.com/package/goog-webfont-dl)

goog-webfont-dl is a [Google WebFont](https://www.google.com/fonts) utility to download webfont files to your local machine.  It attempts to retreieve WOFF, TTF, EOT, and SVG file formats using custom user-agent strings.  It will then output a CSS3 snippet that you can use directly in your project.

## Usage

```
Usage: goog-webfont-dl [options] <fontname>

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -t, --ttf                      Download TTF format
    -e, --eot                      Download EOT format
    -w, --woff                     Download WOFF format
    -W, --woff2                    Download WOFF2 format
    -s, --svg                      Download SVG format
    -a, --all                      Download all formats
    -f, --font [fontname]          Name of font
    -d, --destination [directory]  Save font in directory [default: <fontname>/]
    -o, --out [csspath]            CSS output file [use - for stdout. default: <fontname>.css]
    -p, --prefix [prefix]          Prefix to use in CSS output [default: ../fonts/<fontname>/]
    -u, --subset [string]          Subset string [e.g. latin,cyrillic]
    -y, --styles [string]          Style string [e.g. 300,400,300italic,400italic]
    -P, --proxy [string]           Proxy url [e.g. http://www.myproxy.com/]
```

Install as global command line utility

```shell
npm install -g goog-webfont-dl
```

## Library

This package is compatible with Node 0.12 and above.

```js
const downloader = require('goog-webfont-dl')
// or
import downloader from 'goog-webfont-dl'

const css = downloader('Some Font name')
// or
const css = downloader({
  // required:
  font: 'Some Font name',
  // defaults:
  formats:     downloader.formats, // Font formats.
  destination: font,               // Save font here
  out:         null, // = return   // CSS file. Use '-' for stdout, and nothing to return the CSS code
  prefix:      `../fonts/${font}`, // Prefix to use in CSS output
  subset:      null, // = none     // Subset string/array, e.g. 'latin,cyrillic'
  styles:      downloader.styles,  // Style string/array, e.g. '300,400,300italic,400italic'
  proxy:       null, // = none     // Proxy url, e.g. 'https://myproxy.com'
})
```

Since `Array.prototype.toString` works by joining array elements with commas, `subset` or `styles` can be specified as array as well.

## Example

```shell
goog-webfont-dl -a Lato
```

Output:

```shell
Downloading webfont formats: “ttf,eot,woff,woff2,svg” to folder “Lato”
http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic
CSS output was successfully written to “Lato.css”

$ ls -1 ./Lato
Lato-Black-Italic.ttf
Lato-Black-Italic.woff
Lato-Black-Italic.woff2
Lato-Black.ttf
Lato-Black.woff
Lato-Black.woff2
Lato-Bold-Italic.ttf
Lato-Bold-Italic.woff
Lato-Bold-Italic.woff2
Lato-Bold.ttf
Lato-Bold.woff
Lato-Bold.woff2
Lato-Hairline-Italic.ttf
Lato-Hairline-Italic.woff
Lato-Hairline-Italic.woff2
Lato-Hairline.ttf
Lato-Hairline.woff
Lato-Hairline.woff2
Lato-Italic.ttf
Lato-Italic.woff
Lato-Italic.woff2
Lato-Light-Italic.ttf
Lato-Light-Italic.woff
Lato-Light-Italic.woff2
Lato-Light.ttf
Lato-Light.woff
Lato-Light.woff2
Lato-Regular.eot
Lato-Regular.svg
Lato-Regular.ttf
Lato-Regular.woff
Lato-Regular.woff2
```

Lato.css

```css
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 100;
  src: local('Lato Hairline'), local('Lato-Hairline'), url(../fonts/Lato/Lato-Hairline.woff2) format('woff2'), url(../fonts/Lato/Lato-Hairline.ttf) format('truetype'), url(../fonts/Lato/Lato-Hairline.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  src: local('Lato Light'), local('Lato-Light'), url(../fonts/Lato/Lato-Light.woff2) format('woff2'), url(../fonts/Lato/Lato-Light.ttf) format('truetype'), url(../fonts/Lato/Lato-Light.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: url(../fonts/Lato/Lato-Regular.eot);
  src: local('Lato Regular'), local('Lato-Regular'), local('Lato'), url(../fonts/Lato/Lato-Regular.woff2) format('woff2'), url(../fonts/Lato/Lato-Regular.ttf) format('truetype'), url(../fonts/Lato/Lato-Regular.woff) format('woff'), url(../fonts/Lato/Lato-Regular.eot?#iefix) format('embedded-opentype'), url(../fonts/Lato/Lato-Regular.svg#Lato) format('svg');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: local('Lato Bold'), local('Lato-Bold'), url(../fonts/Lato/Lato-Bold.woff2) format('woff2'), url(../fonts/Lato/Lato-Bold.ttf) format('truetype'), url(../fonts/Lato/Lato-Bold.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  src: local('Lato Black'), local('Lato-Black'), url(../fonts/Lato/Lato-Black.woff2) format('woff2'), url(../fonts/Lato/Lato-Black.ttf) format('truetype'), url(../fonts/Lato/Lato-Black.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 100;
  src: local('Lato Hairline Italic'), local('Lato-HairlineItalic'), url(../fonts/Lato/Lato-Hairline-Italic.woff2) format('woff2'), url(../fonts/Lato/Lato-Hairline-Italic.ttf) format('truetype'), url(../fonts/Lato/Lato-Hairline-Italic.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 300;
  src: local('Lato Light Italic'), local('Lato-LightItalic'), url(../fonts/Lato/Lato-Light-Italic.woff2) format('woff2'), url(../fonts/Lato/Lato-Light-Italic.ttf) format('truetype'), url(../fonts/Lato/Lato-Light-Italic.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: local('Lato Italic'), local('Lato-Italic'), url(../fonts/Lato/Lato-Italic.woff2) format('woff2'), url(../fonts/Lato/Lato-Italic.ttf) format('truetype'), url(../fonts/Lato/Lato-Italic.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(../fonts/Lato/Lato-Bold-Italic.woff2) format('woff2'), url(../fonts/Lato/Lato-Bold-Italic.ttf) format('truetype'), url(../fonts/Lato/Lato-Bold-Italic.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  src: local('Lato Black Italic'), local('Lato-BlackItalic'), url(../fonts/Lato/Lato-Black-Italic.woff2) format('woff2'), url(../fonts/Lato/Lato-Black-Italic.ttf) format('truetype'), url(../fonts/Lato/Lato-Black-Italic.woff) format('woff');
}
```

Font Name:

If the fontname uses spaces, surround the argument with quotes (or use + instead of spaces)

```shell
goog-webfont-dl -a -f "Source Sans Pro" -y 300,400,600,700,300italic,400italic,600italic
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
