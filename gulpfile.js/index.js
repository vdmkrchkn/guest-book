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
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build

    cb();
});

gulp.task('style:build', function (cb) {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(sass()) //Скомпилируем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)); //И в build

    cb();
});

gulp.task('build', gulp.series('style:build', 'html:build'));

// задача на запуск задач, соответствующих измененному файлу
gulp.task('watch', function(cb){
    cb();
    // TODO:
    watch([path.watch.html], 'html:build');
    watch([path.watch.style], 'style:build');
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});