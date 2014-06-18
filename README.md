# gulp-min-map

gulp-min-map is a [gulp](https://github.com/wearefractal/gulp) plugin to create a file minification mapping of local js and css in your HTML files.  It uses HTML5 data attributes to process the min files and optionally will rewrite the js and css links for you.

## Usage

gulp-min-map provide a plugin to retrieve the a { minFile: [sourceFile1, sourceFile2, ..] } mapping.  You can pass this map object in a custom concatenation, minifcation, etc. gulp task.

Install as a dependency into project

```shell
npm install --save-dev gulp-min-map
```

Then use in your gulpfile.js (simple example)

```javascript
var minFiles = {};

gulp.task("deploy-html", function() {
  return gulp.src("build/**/*.html")
    .pipe(plumber())
    .pipe(minMap(['js', 'css'], minFiles))
    .pipe(gulp.dest('release'));
});

gulp.task("deploy-js", function() {
  var streams = [];
  var jsMinFiles = minFiles.js;
  for (var minFile in jsMinFiles) {
    if (jsMinFiles.hasOwnProperty(minFile)) {
      var stream = gulp.src(jsMinFiles[minFile])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat(minFile))
        .pipe(header(copyrightText, {}))
        .pipe(gulp.dest('release'));
      streams.push(stream);
    }
  }

  return es.merge.apply(es, streams);
});


gulp.task("deploy-css", function() {
  var streams = [];
  var cssMinFiles = minFiles.css;
  for (var minFile in cssMinFiles) {
    if (cssMinFiles.hasOwnProperty(minFile)) {
      var stream = gulp.src(cssMinFiles[minFile])
        .pipe(minifyCss())
        .pipe(concat(minFile))
        .pipe(header(copyrightText, {}))
        .pipe(gulp.dest('release'));
      streams.push(stream);
    }
  }

  return es.merge.apply(es, streams);
});
```

## HTML

gulp-min-map will automatically detect local js and css references, and replace the src with the optional data-min attribute.

### Example

Input:

```html
<link rel="stylesheet" href="/css/bootstrap.css" data-min="bootstrap.min.css">
<link rel="stylesheet" href="/css/bootstrap-theme.css" data-min="bootstrap.min.css">
<link rel="stylesheet" href="/css/font-awesome.css" data-min="bootstrap.min.css">
<link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
<link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="/css/home.css">
<link rel="stylesheet" href="/css/admin/admin.css">
```

Output:

```html
<link rel="stylesheet" href="/css/bootstrap.min.css">
<link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
<link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="/css/home.min.css">
<link rel="stylesheet" href="/css/admin/admin.min.css">
```
It will also build a mapping object that you can use for depedent gulp tasks

```json
{
  "css": {
    "css/bootstrap.min.css":
      [ "/home/user/gulp-min-map/test/fixtures/css/bootstrap.css",
        "/home/user/gulp-min-map/test/fixtures/css/bootstrap-theme.css",
        "/home/user/gulp-min-map/test/fixtures/css/font-awesome.css" ],
     "css/home.min.css": [ "/home/user/gulp-min-map/test/fixtures/css/home.css" ],
     "css/admin/admin.min.css": [ "/home/user/gulp-min-map/test/fixtures/css/admin/admin.css" ]
  }
}
```

## Options

### minAttr
Type: string<br/>
Default: "data-min"

The HTML element attribute that specifies the min file name to associate this element with.

### noMinAttr
Type: string<br/>
Default: "data-no-min"

The HTML element attribute that specifies to exclude this element from min file processing when automMin is true.

### autoMin
Type: bool<br/>
Default: true

Minimize files without a data-min attribute.  Otherwise, leave as is.

### defaultMinFile
Type: string<br/>
Default: null

If autoMin is true, use this filename (e.g. 'app.min.js') for all elements without a data-min attribute.  If defaultMinFile is null, the plugin will use the src file name instead (i.e. 'myfile.js' -> 'myfile.min.js').

### updateHTML
Type: bool<br/>
Default: true

Rewrite the input HTML files so the src uses the min files.  Otherwise, the HTML file is left as is.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)