'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/styles/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html:build', function (cb) {
    gulp.src(path.src.html)
        .pipe(rigger())                     // для преобразования шаблонов
        .pipe(gulp.dest(path.build.html));

    cb();
});

gulp.task('style:build', function (cb) {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())            //Инициализация sourcemap
        .pipe(sass())                       //Компиляция
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));

    cb();
});

gulp.task('js:build', function (cb) {
    gulp.src(path.src.js)
        .pipe(rigger())                     //?
        .pipe(sourcemaps.init())            //Инициализация sourcemap
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));

    cb();
});

gulp.task('build', gulp.series('style:build', 'js:build', 'html:build'));

// задача на запуск задач, соответствующих измененному файлу
gulp.task('watch', function(cb){
    watch([path.watch.html], gulp.series('html:build'));
    watch([path.watch.js], gulp.series('js:build'));
    watch([path.watch.style], gulp.series('style:build'));

    cb();
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});