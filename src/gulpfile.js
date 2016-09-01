var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontview = require('./gulp-iconfont-view');
var del = require('del');
var _ = require('lodash');

var fontName = 'examples-fonts';
var generate_folder = "gen/";

gulp.task('default', function(){
  del(generate_folder);
  gulp.src(['svg-icons/*.svg'])
    .pipe(iconfont({
	  formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
	  normalize: true,
      fontName: fontName
    }))
    .on('glyphs', function(glyphs, options) {
        var glyphsMap = []

        for(var i=0;i<glyphs.length; i++){
          if(glyphs[i]&&glyphs[i].name&&glyphs[i].unicode[0]&&glyphs[i].unicode[0].charCodeAt(0)){
            var glyph = {};
            glyph.name = _.kebabCase(glyphs[i].name);
            glyph.unicode = glyphs[i].unicode[0].charCodeAt(0).toString(16).toUpperCase();
            glyphsMap.push(glyph);
          }
    		}

        gulp.src(['templates/**/*'])
          .pipe(iconfontview({
            glyphsMap: glyphsMap,
            fontName: options.fontName
          }))
          .pipe(gulp.dest(generate_folder))
      })
    .pipe(gulp.dest(generate_folder+"icon-font/fonts/"));
});
