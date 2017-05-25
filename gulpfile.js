var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del');

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
    return gulp.src([
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/bootstrap/dist/js/bootstrap.min.js',
      'app/libs/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
});

gulp.task('mv-fonts', function()
{
    var fonts = gulp.src([
      'app/libs/bootstrap/dist/fonts/**/*',
      'app/libs/font-awesome/fonts/**/*'
    ])
    .pipe(gulp.dest('app/fonts'));
});

gulp.task("browser-sync", function() {
    browserSync({
      server: {
        baseDir: 'app'
      },
      notify: false
    });
});

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task("watch",['browser-sync','sass'], function() {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/*.html',browserSync.reload);
  gulp.watch('app/js/**/*.html',browserSync.reload);
});

gulp.task("build", ['css-libs','mv-fonts', 'scripts', 'clean'], function(){
    var buildCSS = gulp.src([
      'app/css/main.css',
      'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJS = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
    var buildHTML = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});
