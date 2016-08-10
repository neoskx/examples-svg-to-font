var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var del = require('del');

var fontName = 'fonts/examples-fonts';
var generate_folder = "gen/";

gulp.task('default', function(){
  del(generate_folder);
  gulp.src(['svg-icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'templates/_icons.css',
      targetPath: 'css/examples-icons.css',
      fontPath: '../'
    }))
    .pipe(iconfont({
      fontName: fontName
     }))
    .pipe(gulp.dest(generate_folder));
});
