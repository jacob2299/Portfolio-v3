const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('sass', () => {
  gulp.src('src/scss/app.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('dist'))
});

gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});

gulp.task('img', () => {
  gulp.src('src/public/img/**/*')
    .pipe(gulp.dest('dist/img'))
});

gulp.task('clean', () => {
  return del.sync(['dist']);
})

gulp.task('watch', ['clean', 'sass', 'html', 'img'], () => {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/public/img/**/*', ['img']);
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'sass', 'html', 'img']);