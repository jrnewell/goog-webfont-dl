# Google WebFont Downloader

goog-webfont-dl is a [Google WebFont](https://www.google.com/fonts) utility to download webfont files to your local machine.  It attempts to retreieve WOFF, TTF, EOT, and SVG file formats using custom user-agent strings.  It will then output a CSS3 snippet that you can use directly in your project.

## Usage

```
Usage: goog-webfont-dl [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -t, --ttf              Download TTF format
    -e, --eot              Download EOT format
    -w, --woff             Download WOFF format
    -W, --woff2            Download WOFF2 format
    -s, --svg              Download SVG format
    -a, --all              Download all formats
    -f, --font [name]      Name of font
    -o, --out [name]       CSS output file [use - for stdout]
    -p, --prefix [prefix]  Prefix to use in CSS output
    -u, --subset [string]  Subset string [e.g. latin,cyrillic]
    -y, --styles [string]  Style string [e.g. 300,400,300italic,400italic]
```

Install as global command line utility

```shell
npm install -g goog-webfont-dl
```

## Example

```shell
goog-webfont-dl -a -f Lato
```

Output:

```shell
Downloading webfont formats: ttf,eot,woff,svg to folder ./Lato
http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic
CSS output was successfully written to Lato.css

$ ls -1 ./Lato
Lato-Black-Italic-latin-ext.woff2
Lato-Black-Italic-latin.woff2
Lato-Black-Italic.ttf
Lato-Black-Italic.woff
Lato-Black-latin-ext.woff2
Lato-Black-latin.woff2
Lato-Black.ttf
Lato-Black.woff
Lato-Bold-Italic-latin-ext.woff2
Lato-Bold-Italic-latin.woff2
Lato-Bold-Italic.ttf
Lato-Bold-Italic.woff
Lato-Bold-latin-ext.woff2
Lato-Bold-latin.woff2
Lato-Bold.ttf
Lato-Bold.woff
Lato-Hairline-Italic-latin-ext.woff2
Lato-Hairline-Italic-latin.woff2
Lato-Hairline-Italic.ttf
Lato-Hairline-Italic.woff
Lato-Hairline-latin-ext.woff2
Lato-Hairline-latin.woff2
Lato-Hairline.ttf
Lato-Hairline.woff
Lato-Italic-latin-ext.woff2
Lato-Italic-latin.woff2
Lato-Italic.ttf
Lato-Italic.woff
Lato-Light-Italic-latin-ext.woff2
Lato-Light-Italic-latin.woff2
Lato-Light-Italic.ttf
Lato-Light-Italic.woff
Lato-Light-latin-ext.woff2
Lato-Light-latin.woff2
Lato-Light.ttf
Lato-Light.woff
Lato-Regular-latin-ext.woff2
Lato-Regular-latin.woff2
Lato-Regular.svg
Lato-Regular.ttf
Lato-Regular.woff
```

Lato.css

```css
/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 100;
  src: local('Lato Hairline'), local('Lato-Hairline'), url(../fonts/Lato-Hairline-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  src: local('Lato Light'), local('Lato-Light'), url(../fonts/Lato-Light-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(../fonts/Lato-Regular-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: local('Lato Bold'), local('Lato-Bold'), url(../fonts/Lato-Bold-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  src: local('Lato Black'), local('Lato-Black'), url(../fonts/Lato-Black-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 100;
  src: local('Lato Hairline Italic'), local('Lato-HairlineItalic'), url(../fonts/Lato-Hairline-Italic-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 300;
  src: local('Lato Light Italic'), local('Lato-LightItalic'), url(../fonts/Lato-Light-Italic-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: local('Lato Italic'), local('Lato-Italic'), url(../fonts/Lato-Italic-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(../fonts/Lato-Bold-Italic-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  src: local('Lato Black Italic'), local('Lato-BlackItalic'), url(../fonts/Lato-Black-Italic-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 100;
  src: local('Lato Hairline'), local('Lato-Hairline'), url(../fonts/Lato-Hairline-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  src: local('Lato Light'), local('Lato-Light'), url(../fonts/Lato-Light-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(../fonts/Lato-Regular-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: local('Lato Bold'), local('Lato-Bold'), url(../fonts/Lato-Bold-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  src: local('Lato Black'), local('Lato-Black'), url(../fonts/Lato-Black-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 100;
  src: local('Lato Hairline Italic'), local('Lato-HairlineItalic'), url(../fonts/Lato-Hairline-Italic-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 300;
  src: local('Lato Light Italic'), local('Lato-LightItalic'), url(../fonts/Lato-Light-Italic-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: local('Lato Italic'), local('Lato-Italic'), url(../fonts/Lato-Italic-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(../fonts/Lato-Bold-Italic-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

/* latin */
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  src: local('Lato Black Italic'), local('Lato-BlackItalic'), url(../fonts/Lato-Black-Italic-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 100;
  src: local('Lato Hairline'), local('Lato-Hairline'), url(../fonts/Lato-Hairline.woff) format('woff'), url(../fonts/Lato-Hairline.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  src: local('Lato Light'), local('Lato-Light'), url(../fonts/Lato-Light.woff) format('woff'), url(../fonts/Lato-Light.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(../fonts/Lato-Regular.woff) format('woff'), url(../fonts/Lato-Regular.svg#Lato) format('svg'), url(../fonts/Lato-Regular.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: local('Lato Bold'), local('Lato-Bold'), url(../fonts/Lato-Bold.woff) format('woff'), url(../fonts/Lato-Bold.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  src: local('Lato Black'), local('Lato-Black'), url(../fonts/Lato-Black.woff) format('woff'), url(../fonts/Lato-Black.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 100;
  src: local('Lato Hairline Italic'), local('Lato-HairlineItalic'), url(../fonts/Lato-Hairline-Italic.woff) format('woff'), url(../fonts/Lato-Hairline-Italic.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 300;
  src: local('Lato Light Italic'), local('Lato-LightItalic'), url(../fonts/Lato-Light-Italic.woff) format('woff'), url(../fonts/Lato-Light-Italic.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: local('Lato Italic'), local('Lato-Italic'), url(../fonts/Lato-Italic.woff) format('woff'), url(../fonts/Lato-Italic.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(../fonts/Lato-Bold-Italic.woff) format('woff'), url(../fonts/Lato-Bold-Italic.ttf) format('truetype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  src: local('Lato Black Italic'), local('Lato-BlackItalic'), url(../fonts/Lato-Black-Italic.woff) format('woff'), url(../fonts/Lato-Black-Italic.ttf) format('truetype');
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)