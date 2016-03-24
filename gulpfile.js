const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

gulp.task('dist', function() {
  return gulp.src('js/*.js')
    .pipe(concat('hopa.js'))
    .pipe(minify({
        ext:{
            min:'.js'
        }
    }))
    .pipe(gulp.dest('dist'));
});
