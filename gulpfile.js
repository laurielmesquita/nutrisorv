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

// Compile and compress Sass to CSS and copy Css to dist
gulp.task('sass', function() {
   gulp.src([
      './app/sass/**/*.scss',
      './app/styles/**/*.css'
   ])
   .pipe(sass())
   .pipe(autoprefixer())
   .pipe(cssnano())
   .pipe(gulp.dest('./dist/styles/'));
})

// Html include and copy
gulp.task('html', function(){
   return gulp.src([
      './app/**/*.html',
      '!src/inc/**/*'
   ])
   .pipe(include())
   .pipe(gulp.dest('./dist/'))
})

// Less Css
gulp.task('uncss', ['html'], function(){
   return gulp.src('./dist/styles/**/*.css')
   .pipe(uncss({
      html: ['./dist/**/*.html']
   }))
   .pipe(gulp.dest('./dist/styles/'))
})

// Optimize images
gulp.task('imagemin', function(){
   return gulp.src('./app/images/**/*')
   .pipe(imagemin())
   .pipe(gulp.dest('./dist/images/'))
})

// Concat and minify javascript
gulp.task('buildjs', function(){
   return gulp.src([
      './app/scripts/**/*',
      '!./app/scripts/jquery-3.2.1.slim.min.js',
      '!./app/scripts/popper.min.js',
      '!./app/scripts/bootstrap.min.js'
   ])
   .pipe(concat('app.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('./dist/scripts/'))
})

// Minify and prefix SVG
gulp.task('svgmin', function(){
   return gulp.src(['./app/inc/icons/*.svg', '!./app/inc/icons/*.min.svg'])
   .pipe(imagemin())
   .pipe(rename({
      suffix: '.min'
   }))
   .pipe(gulp.dest('./app/inc/icons/'))
})

// Default
gulp.task('default', ['copy'], function(){
   gulp.start('sass', 'imagemin', 'uncss', 'buildjs')
})

// Watch files for changes & reload
gulp.task('server', () => {
   browserSync({
      notify: false,
      logPrefix: 'NUTRI SORV',
      server: ['dist/']
   });

   gulp.watch('./dist/**/*').on('change', browserSync.reload)
   gulp.watch('./app/**/*.html', ['html'])
   gulp.watch('./app/scripts/*.js', ['buildjs'])
   gulp.watch('./app/images/**/*', ['imagemin'])
   gulp.watch('./app/sass/**/*.scss', ['sass'])
   gulp.watch([
      './app/inc/icons/*.svg',
      '!./app/inc/icons/*.min.svg'
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
      './app/scripts/jquery-3.2.1.slim.min.js',
      './app/scripts/popper.min.js',
      './app/scripts/bootstrap.min.js'
   ], {'base': 'app'})
   .pipe(gulp.dest('./dist'))
})
