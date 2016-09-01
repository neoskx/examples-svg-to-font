const path = require('path');
const fs =require('fs');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const _ = require('lodash');
const mustache = require('mustache');

const Transform = require('stream').Transform;

// plugin name
var PLUGIN_NAME = 'gulp-iconfont-view';

module.exports = function(config){
  let transform = new Transform({objectMode: true});

  function isTemplate(filePath){
    let extname = path.extname(filePath);
    if(extname == '.mustache'){
      return true;
    }
    return false;
  }

  function updateFilePath(filePath){

    if(isTemplate(filePath)){
      let dir = path.dirname(filePath)
      let filename = path.basename(filePath, '.mustache');
      return path.join(dir, filename);
    }

    return filePath;
  }

  let defaultOptions = {
    fontName: "IconFont",
    basicIconClass: "icon",
    fontPath: "../fonts/",
    glyphsMap:[],
    isTemplate: isTemplate,
    updateFilePath: updateFilePath
  };

  let nConfig = _.merge(defaultOptions, config);

  // TODO valiate required field

  transform._transform = function(file, encoding, cb){
    // if it is template render template use nConfig
    if(nConfig.isTemplate(file.path)){
      // console.log(file.path);
      let template = fs.readFileSync(file.path, {"encoding": "utf8"});
      // console.log(template);
      let rendered = mustache.render(template, nConfig);
      // console.log(rendered);
      rendered = new Buffer(rendered);
      if(file.isBuffer()){
        file.contents = rendered;
      }else{
        file.contents.write(rendered);
				file.contents.end();
      }
    }

    file.path = nConfig.updateFilePath(file.path);

		this.push(file);
		cb();
  };

  transform._flush = function(cb){
		cb();
  }

  return transform;
};
