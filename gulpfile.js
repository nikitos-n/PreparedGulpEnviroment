const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');//Минификация css-кода
var uglify = require('gulp-uglify');//Минификация JS-кода
const del = require('del');
const browserSync = require('browser-sync').create();

const orderOfJSFiles = [
    './src/js/first.js',
    './src/js/second.js'
]

const orderOfCSSFiles = [
    './node_modules/normalize.css/normalize.css',//Сбрасываем все по умолчанию css-стили
    './src/styles/first.css',
    './src/styles/second.css'
]

const scripts = () => {
    console.log('Running task scripts!');
    return gulp.src(orderOfJSFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true//Минификация будет выполнена самым жестким образом
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

const styles = () => {
    console.log('Running task styles!');
    return gulp.src(orderOfCSSFiles)
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['>0.01%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2//Для абсолютной минификации
        }))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(browserSync.stream());
}

const watch = () => {
    browserSync.init({
        server: {
            baseDir: './'//Указываем, в какой папке искать html файлы
        }
    });
    gulp.watch('./src/styles/*.css', styles);
    gulp.watch('./src/js/*.js', scripts);
}

const clean = () => {
    return del(['./dist/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
    gulp.parallel(styles, scripts)
));

gulp.task('dev', gulp.series('build', 'watch'));