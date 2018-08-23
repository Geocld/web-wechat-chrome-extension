const gulp = require('gulp');
const minify = require('gulp-minify');

gulp.task('minify', function() {
    return gulp.src('src/chrome/*.js')
        .pipe(minify({
            ext:{
                src:'*.js',
                min:'.js'
            },
            noSource: true
        }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('build/chrome'))
});

gulp.task('minify-background', function() {
    return gulp.src('src/background.js')
        .pipe(minify({
            ext:{
                src:'*.js',
                min:'.js'
            },
            noSource: true
        }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('build'))
});