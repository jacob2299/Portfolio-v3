const gulp = require('gulp');
const sass = require('gulp-sass');
const image = require('gulp-image');
const inject = require('gulp-inject');
const replace = require('gulp-replace');
const flatten = require('gulp-flatten')
const del = require('del');

gulp.task('sass', () => {
  gulp.src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});

gulp.task('img', () => {
  gulp.src('src/public/img/**/*')
    .pipe(flatten())
    .pipe(gulp.dest('dist/img'))
});

gulp.task('img-build', () => {
  gulp.src('src/public/img/**/*')
    .pipe(image())
    .pipe(flatten())
    .pipe(gulp.dest('dist/img'))
})

gulp.task('replace-img', () => {
  gulp.src('dist/*.html')
    .pipe(replace(/<img src\s*=\s*"(.+?)">/g), (match, p1, offset, string) => {
      const regex = /\/.+\.jpg/g;
      const file = match.match(regex);
      return `<img src="img${file}">`;
    })
    .pipe(gulp.dest('dist'))
});

gulp.task('clean', () => {
  return del.sync(['dist']);
})

gulp.task('inject', () => {
  const sources = gulp.src('dist/css/app.css', { read: false });

  gulp.src('dist/*.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['clean', 'sass', 'html', 'img', 'replace-img', 'inject'], () => {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/public/img/**/*', ['img', 'replace-img']);
  gulp.watch('dist/**/*.html', ['inject']);
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'sass', 'html', 'img-build', 'replace-img']);