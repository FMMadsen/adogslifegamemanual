'use strict';

const { watch, series, parallel, src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const flatten = require('gulp-flatten');
const rm = require('gulp-rm');
const mustache = require("gulp-mustache");
const rename = require("gulp-rename");
const connect = require('gulp-connect');

/********************************************
 *  WEBSERVER
 ********************************************/
function startWebserver() {
    connect.server();
};

/********************************************
 *  SASS TASKS
 ********************************************/
const transpileSass = parallel(sassGridlex, sassCustom);

function sassGridlex() {
    return src('./style/vendor/gridlex/**/gridlex.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(dest('./dist/css'));
}

function sassCustom() {
    return src('./style/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(dest('./dist/css'));
}

/********************************************
 *  HTML GENERATION WITH MUSTACHE
 ********************************************/
const generateHtml = parallel(generateHtmlEn, generateHtmlDk);

function generateHtmlEn() {
    return src('./content/template.html')
        .pipe(mustache('./content/content-en.json', {}, {}))
        .pipe(rename('index.html'))
        .pipe(dest('./en'));
}

function generateHtmlDk() {
    return src('./content/template.html')
        .pipe(mustache('./content/content-da.json', {}, {}))
        .pipe(rename('index.html'))
        .pipe(dest('./da'));
}

/********************************************
 *  FILE COPY TASKS
 ********************************************/
const copyStaticFiles = parallel(copyNormalizeCss, copyBoilerplateCss, copyFonts, copyJavaScript);

function copyNormalizeCss() {
    return src('./style/vendor/normalize/**/*.css')
        .pipe(flatten())
        .pipe(dest('./dist/css'));
}
function copyBoilerplateCss() {
    return src('./style/vendor/html5boilerplate/**/*.*')
        .pipe(flatten())
        .pipe(dest('./dist/css'));
}
function copyFonts() {
    return src('./style/fonts/*.*')
        .pipe(flatten())
        .pipe(dest('./dist/fonts'));
}
function copyJavaScript() {
    return src('./script/**/*.js')
        .pipe(flatten())
        .pipe(dest('./dist/js'));
}

/********************************************
 *  FILE REMOVE
 ********************************************/
function cleanDist() {
    return src(['dist', './dist/**/*'], { read: false, allowEmpty: true }).pipe(rm());
}

/********************************************
 *  EXPORTED 'PUBLIC' TASKS (CALLED FROM CMD)
 ********************************************/
function defaultTask(cb) {
    console.log('Running default task for Gulp');
    console.log('Possible gulp tasks');
    console.log(' - build');
    console.log(' - serve');
    console.log('Or specific tasks Possible gulp tasks');
    console.log(' - clean');
    console.log(' - styles');
    console.log(' - html');
    cb();
}

exports.default = defaultTask;
exports.build = series(cleanDist, parallel(generateHtml, transpileSass, copyStaticFiles));
exports.serve = startWebserver;
exports.clean = cleanDist;
exports.styles = transpileSass;
exports.html = generateHtml;