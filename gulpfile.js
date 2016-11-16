var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require('autoprefixer');
var browserSync = require("browser-sync");
var gcmq = require('gulp-group-css-media-queries');
var minify = require('gulp-csso');
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var gulpSequence = require("gulp-sequence");
var del = require("del");

gulp.task("watch", ["sass"],function() {
  browserSync.init({
    server: "./", notify: false
  });
  gulp.watch("sass/**/*.scss", ["sass"]);
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("js/*.js").on("change", browserSync.reload);
});

gulp.task("sass", function() {
    return gulp.src("sass/style.scss")
  .pipe(sass().on("error", sass.logError))
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 5 version",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Opera versions",
      "last 2 Edge versions"
    ]})
  ]))
  .pipe(gulp.dest("css"))
  .pipe(browserSync.reload({stream: true}))
});


gulp.task("style", function() {
	gulp.src("sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 5 version",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Opera versions",
      "last 2 Edge versions"
    ]})
]))
  .pipe(gcmq())
  .pipe(gulp.dest("build/css"))
  .pipe(browserSync.reload({stream: true}))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))

    .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build/*");
});

gulp.task("build", function(fn) {
  gulpSequence("clean", "copy", "style", "images", "symbols", fn);
});
