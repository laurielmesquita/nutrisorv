/**
*  NUTRI SORV
*  2017
*/

'use strict';

var gulp = require('gulp')
, sass = require('gulp-sass')
, include = require('gulp-file-include')
, clean = require('gulp-clean')
, autoprefixer = require('gulp-autoprefixer')
, uncss = require('gulp-uncss')
, imagemin = require('gulp-imagemin')
, cssnano = require('gulp-cssnano')
, concat = require('gulp-concat')
, uglify = require('gulp-uglify')
, rename = require('gulp-rename')
, browserSync = require('browser-sync');

// Compress, prefix and process Sass to CSS
gulp.task('sass', function() {
   gulp.src('./src/sass/**/*.scss')
   .pipe(sass())
   .pipe(autoprefixer())
   .pipe(cssnano())
   .pipe(gulp.dest('./dist/css/'));
})

// Html include and copy
gulp.task('html', function(){
   return gulp.src([
      './src/**/*.html',
      '!src/inc/**/*'
   ])
   .pipe(include())
   .pipe(gulp.dest('./dist/'))
})

// Less Css
gulp.task('uncss', ['html'], function(){
   return gulp.src('./dist/components/**/*.css')
   .pipe(uncss({
      html: ['./dist/**/*.html']
   }))
   .pipe(gulp.dest('./dist/components/'))
})

// Optimize images
gulp.task('imagemin', function(){
   return gulp.src('./src/imagens/**/*')
   .pipe(imagemin())
   .pipe(gulp.dest('./dist/imagens/'))
})

// Concat and minify javascript
gulp.task('buildjs', function(){
   return gulp.src('./src/javascript/**/*')
   .pipe(concat('app.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('./dist/javascript/'))
})

// Minify and prefix SVG
gulp.task('svgmin', function(){
   return gulp.src(['src/inc/icons/*.svg', '!src/inc/icons/*.min.svg'])
   .pipe(imagemin())
   .pipe(rename({
      suffix: '.min'
   }))
   .pipe(gulp.dest('./src/inc/icons/'))
})

// Default
gulp.task('default', ['copy'], function(){
   gulp.start('uncss', 'imagemin', 'sass', 'buildjs')
})

// Watch files for changes & reload
gulp.task('server', () => {
   browserSync({
    notify: false,
    logPrefix: 'FRONT-END',
    server: ['dist/']
   });

   gulp.watch('./dist/**/*').on('change', browserSync.reload)
   gulp.watch('./src/**/*.html', ['html'])
   gulp.watch('./src/javascript/*.js', ['buildjs'])
   gulp.watch('./src/imagens/**/*', ['imagemin'])
   gulp.watch('./src/sass/**/*.scss', ['sass'])
   gulp.watch([
      './src/inc/icons/*.svg',
      '!./src/inc/icons/*.min.svg'
   ], ['svgmin'])
});

// Clean dist files and directory
gulp.task('clean', function(){
   return gulp.src('./dist')
   .pipe(clean());
})

// Copy components files
gulp.task('copy', ['clean'], function(){
   return gulp.src([
      './src/components/bootstrap/dist/**/*',
      './src/components/bootstrap/fonts/**/*',
      './src/components/bootstrap/js/**/*',
   ], {'base': 'src'})
   .pipe(gulp.dest('./dist'))
})
