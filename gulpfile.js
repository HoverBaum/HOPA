const gulp = require('gulp');
const concat = require('gulp-concat');
const jsmin = require('gulp-jsmin');

gulp.task('dist', function() {
  return gulp.src('js/*.js')
    .pipe(concat('hopa.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('dist'));
});
