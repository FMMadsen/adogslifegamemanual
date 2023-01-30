'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    rm = require('gulp-rm'),
    flatten = require('gulp-flatten'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    mustache = require('gulp-mustache');

/********************************************
 *  WEBSERVER
 ********************************************/
gulp.task('connect', function() {
    connect.server({
        name: 'Dev App',
        root: '.',
        port: 8014,
        livereload: true,
    });
});
gulp.task('reload_page', function() {
    gulp.src('./*.html').pipe(connect.reload());
});
gulp.task('webserver-watch', function() {
    gulp.watch(['./*.html', 'en/*', 'da/*', './dist/**/*.*'], ['reload_page']);
});

/********************************************
 *  SASS TASKS
 ********************************************/
gulp.task('sass', ['sass-gridlex', 'sass-custom']);
gulp.task('sass-gridlex', function() {
    return gulp
        .src(['./style/vendor/gridlex/**/gridlex.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('sass-custom', function() {
    return gulp
        .src(['./style/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('watch-sass-custom', function() {
    gulp.watch(['./style/*.scss'], ['sass-custom']);
});

/********************************************
 *  HTML GENERATION WITH MUSTACHE
 ********************************************/
gulp.task('generate-html', ['generate-html-en', 'generate-html-da']);
gulp.task('generate-html-en', function() {
    return gulp
        .src('./content/template.html')
        .pipe(mustache('./content/content-en.json', {}, {}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./en'));
});
gulp.task('generate-html-da', function() {
    return gulp
        .src('./content/template.html')
        .pipe(mustache('./content/content-da.json', {}, {}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./da'));
});
gulp.task('watch-html-template', function() {
    gulp.watch(['./content/template.html'], ['generate-html']);
});
gulp.task('watch-content-en', function() {
    gulp.watch(['./content/content-en.json'], ['generate-html-en']);
});
gulp.task('watch-content-da', function() {
    gulp.watch(['./content/content-da.json'], ['generate-html-da']);
});
/********************************************
 *  FILE COPY TASKS
 ********************************************/
gulp.task('copy-files', ['copy-normalize-css', 'copy-boilerplate-css', 'copy-js', 'copy-fonts']);
gulp.task('copy-normalize-css', function() {
    return gulp
        .src(['./style/vendor/normalize/**/*.css'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('copy-boilerplate-css', function() {
    return gulp
        .src(['./style/vendor/html5boilerplate/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('copy-js', function() {
    return gulp
        .src(['./script/**/*.js'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('copy-fonts', function() {
    return gulp
        .src(['./style/fonts/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/fonts'));
});

/********************************************
 *  FILE REMOVE
 ********************************************/
gulp.task('clean-dist', function() {
    return gulp.src(['dist', './dist/**/*', './da', './da/**/*', './en', './en/**/*'], { read: false })
        .pipe(rm())
});

/********************************************
 *  JAVASCRIPT BUNDLING TASKS
 ********************************************/


/********************************************
 *  WATCH
 ********************************************/
gulp.task('watch-all', ['webserver-watch', 'watch-sass-custom', 'watch-html-template', 'watch-content-en', 'watch-content-da'])

/********************************************
 *  TASKS CALLED FROM COMMAND PROMPT
 ********************************************/
gulp.task('clean', ['clean-dist']);
gulp.task('default', ['generate-html', 'copy-files', 'sass']);
gulp.task('observer', ['generate-html', 'copy-files', 'sass', 'connect']);
gulp.task('development', ['generate-html', 'copy-files', 'sass', 'connect', 'watch-all']);
gulp.task('webserver', ['connect']);