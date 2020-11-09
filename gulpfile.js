var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var sourcemaps = require("gulp-sourcemaps");
var inject = require('gulp-inject');
var babel = require("gulp-babel");
var concat = require("gulp-concat");


function gulp_inject(){
  var target = gulp.src('./index.html');
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

  return target.pipe(inject(sources))
   .pipe(gulp.dest('./'));
}

function scss_style(done){
  gulp.src('./src/styles/scss/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    errorLogToConsole: true,
    outputStyle: 'compressed'
  }))
  .on('error', console.error.bind(console))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions'],
    cascade: false
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./src/styles/css/'))
  .pipe(browserSync.stream());
  done();
}
function watchFiles() {
  gulp.watch("./src/styles/scss/*", gulp.parallel(scss_style, gulp_inject));
  gulp.watch("./src/styles/css/*", browserReload);
  gulp.watch("./**/*.html", browserReload);
  gulp.watch("./**/*.js", gulp.parallel(browserReload, gulp_inject));
}

function sync(done) {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000
  });
  done();
}

function browserReload(done) {
  browserSync.reload();
  done();
}
function babelComp() {
 return gulp.src("src/**/*.js")
   .pipe(sourcemaps.init())
   .pipe(babel())
   .pipe(concat("all.js"))
   .pipe(sourcemaps.write("."))
   .pipe(gulp.dest("dist"));
}

gulp.task('default', gulp.parallel(sync, watchFiles, babelComp));
