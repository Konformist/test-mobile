const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concatCss = require('gulp-concat-css');
const urlAdjuster = require('gulp-css-url-adjuster');
const babel = require('gulp-babel');
const jsmin = require('gulp-jsmin');
const concat = require('gulp-concat-sourcemap');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const addsrc = require('gulp-add-src');

gulp.task('default', [
    'build-html',
    'build-css',
    'copy-fonts',
    'build-fonts',
    'build-images',
    'build-js',
    'build-pages',
]);

gulp.task('watch', () => {
    gulp.watch('./html/**/*.html', ['build-html']);
    gulp.watch('./scss/**/*.scss', ['build-css']);
    gulp.watch('./fonts/*', ['copy-fonts', 'build-fonts']);
    gulp.watch('./images/**/*', ['build-images']);
    gulp.watch('./js/*.js', ['build-js']);
    gulp.watch('./app/**/*.js', ['build-pages']);
});

gulp.task('build-html', () => {
    gulp.src('./html/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('./www'))
});

gulp.task('build-css', () => {
    gulp.src('./scss/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
        }))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./www/css'))
});

gulp.task('build-js', () => {
    gulp.src('./js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./www/js'))
});

gulp.task('build-pages', () => {
    gulp.src('./app/pager.js')
        .pipe(addsrc.append('./app/articles-view.js'))
        .pipe(addsrc.append('./app/articles.js'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            plugins: ['transform-es2015-modules-umd']
        }))
        .pipe(concat('articles.min.js'))
        .pipe(jsmin())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./www/js'))
});

gulp.task('copy-fonts', () => {
    gulp.src('./fonts/*')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest('./www/fonts'))
});

gulp.task('build-fonts', () => {
    gulp.src('./fonts/*.css')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(concatCss('fonts.min.css'))
        .pipe(urlAdjuster({ prepend: '/fonts/' }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./www/css'))
});

gulp.task('build-images', () => {
    gulp.src('./images/**/*')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(imagemin())
        .pipe(gulp.dest('./www/images'))
});
