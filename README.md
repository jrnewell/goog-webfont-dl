# Google WebFont Downloader

goog-webfont-dl is a [Google WebFont](https://www.google.com/fonts) utility to download font files to your local machine.  It attempts to retreieve WOFF, TTF, EOT, and SVG formats using custom user-agent strings.  It will then output a CSS3 snippet that you can use in your project.

## Usage

```
Usage: goog-webfont-dl [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -t, --ttf              Download TTF format
    -e, --eot              Download EOT format
    -w, --woff             Download WOFF format
    -s, --svg              Download SVG format
    -a, --all              Download all formats
    -f, --font [name]      Name of font
    -o, --out [name]       CSS output file [use - for stdout]
    -p, --prefix [prefix]  Prefix to use in CSS output
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
Lato-Black-Italic.eot
Lato-Black-Italic.ttf
Lato-Black-Italic.woff
Lato-Black.eot
Lato-Black.ttf
Lato-Black.woff
Lato-Bold-Italic.eot
Lato-Bold-Italic.ttf
Lato-Bold-Italic.woff
Lato-Bold.eot
Lato-Bold.ttf
Lato-Bold.woff
Lato-Hairline-Italic.eot
Lato-Hairline-Italic.ttf
Lato-Hairline-Italic.woff
Lato-Hairline.eot
Lato-Hairline.ttf
Lato-Hairline.woff
Lato-Italic.eot
Lato-Italic.ttf
Lato-Italic.woff
Lato-Light-Italic.eot
Lato-Light-Italic.ttf
Lato-Light-Italic.woff
Lato-Light.eot
Lato-Light.ttf
Lato-Light.woff
Lato-Regular.eot
Lato-Regular.svg
Lato-Regular.ttf
Lato-Regular.woff
```

Lato.css

```css
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 100;
  src: url(../fonts/Lato-Hairline.eot);
  src: local('Lato Hairline'), local('Lato-Hairline'), url(../fonts/Lato-Hairline.woff) format('woff'), url(../fonts/Lato-Hairline.ttf) format('truetype'), url(../fonts/Lato-Hairline.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  src: url(../fonts/Lato-Light.eot);
  src: local('Lato Light'), local('Lato-Light'), url(../fonts/Lato-Light.woff) format('woff'), url(../fonts/Lato-Light.ttf) format('truetype'), url(../fonts/Lato-Light.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: url(../fonts/Lato-Regular.eot);
  src: local('Lato Regular'), local('Lato-Regular'), url(../fonts/Lato-Regular.svg#Lato) format('svg'), url(../fonts/Lato-Regular.woff) format('woff'), url(../fonts/Lato-Regular.ttf) format('truetype'), url(../fonts/Lato-Regular.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: url(../fonts/Lato-Bold.eot);
  src: local('Lato Bold'), local('Lato-Bold'), url(../fonts/Lato-Bold.woff) format('woff'), url(../fonts/Lato-Bold.ttf) format('truetype'), url(../fonts/Lato-Bold.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  src: url(../fonts/Lato-Black.eot);
  src: local('Lato Black'), local('Lato-Black'), url(../fonts/Lato-Black.woff) format('woff'), url(../fonts/Lato-Black.ttf) format('truetype'), url(../fonts/Lato-Black.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 100;
  src: url(../fonts/Lato-Hairline-Italic.eot);
  src: local('Lato Hairline Italic'), local('Lato-HairlineItalic'), url(../fonts/Lato-Hairline-Italic.woff) format('woff'), url(../fonts/Lato-Hairline-Italic.ttf) format('truetype'), url(../fonts/Lato-Hairline-Italic.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 300;
  src: url(../fonts/Lato-Light-Italic.eot);
  src: local('Lato Light Italic'), local('Lato-LightItalic'), url(../fonts/Lato-Light-Italic.woff) format('woff'), url(../fonts/Lato-Light-Italic.ttf) format('truetype'), url(../fonts/Lato-Light-Italic.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: url(../fonts/Lato-Italic.eot);
  src: local('Lato Italic'), local('Lato-Italic'), url(../fonts/Lato-Italic.woff) format('woff'), url(../fonts/Lato-Italic.ttf) format('truetype'), url(../fonts/Lato-Italic.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: url(../fonts/Lato-Bold-Italic.eot);
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(../fonts/Lato-Bold-Italic.woff) format('woff'), url(../fonts/Lato-Bold-Italic.ttf) format('truetype'), url(../fonts/Lato-Bold-Italic.eot?#iefix) format('embedded-opentype');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  src: url(../fonts/Lato-Black-Italic.eot);
  src: local('Lato Black Italic'), local('Lato-BlackItalic'), url(../fonts/Lato-Black-Italic.woff) format('woff'), url(../fonts/Lato-Black-Italic.ttf) format('truetype'), url(../fonts/Lato-Black-Italic.eot?#iefix) format('embedded-opentype');
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)