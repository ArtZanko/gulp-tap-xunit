# gulp-tap-xunit
A gulp plugin for wrapping [tape](https://github.com/substack/tape) results to xUnit format.

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install gulp-tap-xunit
```

## Usage

```javascript
var fs = require('fs');
var gulp = require('gulp');
var tapXml = require('gulp-tap-xunit');

var out = fs.createWriteStream('result.xml');

gulp.task('tape.test', function () {
    return gulp.src(['js/**/*.js'])
            .pipe(tapXml())
            .pipe(out);
});
```
