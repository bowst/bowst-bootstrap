var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require("gulp-notify");
var install = require("gulp-install");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create(); 
var reload = browserSync.reload; 

var config = {
    sassPath: './src/scss',
    npmPath: './node_modules'
}

gulp.task('npm', function () {
  return gulp.src(['./package.json'])
    .pipe(install());
});
  
gulp.task('icons', function() {
  return gulp.src([
          config.npmPath + '/font-awesome/fonts/**.*',
          config.npmPath + '/bootstrap-sass/assets/fonts/**/**.*',
      ])
      .pipe(gulp.dest('./public/fonts'));
});

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.sassPath,
                config.npmPath + '/bootstrap-sass/assets/stylesheets',
                config.npmPath + '/font-awesome/scss'
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({stream: true}));
});

gulp.task('vendor.js', function () {
  return gulp.src([
            config.npmPath + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('templates', function () { 
    nunjucksRender.nunjucks.configure(['./src/templates/']); 
    return gulp.src('./src/templates/*.html') 
        .pipe(nunjucksRender()) 
        .pipe(gulp.dest('./public')) 
        .pipe(reload({stream: true})); 
});

gulp.task('serve', ['npm', 'icons', 'css', 'vendor.js', 'templates'], function() { 
    browserSync.init({ server: "./public" }); 
    gulp.watch("./src/templates/*.html", ['templates']); 
    gulp.watch("./src/scss/*.scss", ['css']); 
    gulp.watch("./public/*.html").on('change', reload); 
}); 

gulp.task('default', ['serve']);