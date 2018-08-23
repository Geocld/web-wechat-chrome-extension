var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');

gulp.task('minify', function() {
    return gulp.src('src/chrome/*.js')
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('build/chrome'))
});

gulp.task('minify-background', function() {
    return gulp.src('src/background.js')
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('build/'))
});