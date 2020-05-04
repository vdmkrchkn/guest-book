'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    ts = require('gulp-typescript');

var path = {
    build: { // относительные пути готовых после сборки файлов
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { // пути откуда брать исходники
        html: 'src/*.html',
        ts: 'src/js/main.ts', // В скриптах только main файлы
        style: 'src/styles/main.scss', // и стилях
        img: 'src/img/**/*.*', // взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // типы файлов, за изменением которых наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.ts',
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
    let tsProject = ts.createProject('tsconfig.json');    
    tsProject.src()
        .pipe(tsProject())
        //.pipe(rigger())                  // TODO:
        // .pipe(sourcemaps.init())        // Инициализация sourcemap
        // .pipe(sourcemaps.write())
        .js.pipe(gulp.dest(path.build.js));

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