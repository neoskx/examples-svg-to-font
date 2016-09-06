const fs = require('fs-extra');
const path = require('path');
const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');
const logger = require('winston');
const del = require('del');
const gutil = require('gulp-util');
const Transform = require('stream').Transform;
const fontforge = require('./engines/fontforge');

// plugin name
let PLUGIN_NAME = 'gulp-fontforge';
/*
## options
### font
Type: `string` Default: `iconfonts`

Name of font and base name of font files.

### fontFilename
Type: `string` Default: Same as `font` option

Filename for generated font files.

### types
Type: `string|array` Default: `eot,woff,ttf`. Available: `'eot,woff2,woff,ttf,svg'`

Font files types to generate

### optimize
Type: `boolean` Default: `true`

If `false` the SVGO optimization will not be used. This is useful in cases where the optimizer will produce faulty web fonts by removing relevant SVG paths or attributes.

### normalize
Type: `boolean` Default: `false`

When using the fontforge engine, if false, glyphs will be generated with a fixed width equal to fontHeight. In most cases, this will produce an extra blank space for each glyph. If set to true, no extra space will be generated. Each glyph will have a width that matches its boundaries.

### startCodepoint
Type: `integer` Default: 0xF101

Starting codepoint used for the generated glyphs. Defaults to the start of the Unicode private use area.

### codepoints
Type: `object` Default: `null`

Specific codepoints to use for certain glyphs. Any glyphs not specified in the codepoints block will be given incremented as usual from the startCodepoint, skipping duplicates.

```
options: {
    codepoints: {
        single: 0xE001
    }
}
```

### codepointsFile
Type: `string` Default: `iconfonts-codepoints.json`

Uses and Saves the codepoint mapping by name to this file.

NOTE: will overwrite the set codepoints option.

### autoHint
Type: `boolean` Default: `true`

Enables font auto hinting using `ttfautohint`

### round
Type: `number` Default: `10e12`

Setup SVG path rounding

### fontHeight
Type: `number` Default: `512`

The output font height

### descent
Type: `number` Default: 64

The font descent. The descent should be a positive value. The ascent formula is: `ascent = fontHeight - descent`

*/
module.exports = function(options){
  let transform = new Transform({objectMode: true});
  let files = [];
  let glyphs = [];
  let currentCodepoint;

  let defaultOptions = {
    logger: logger,
    font: 'iconfonts',
    fontHeight: 512,
    descent: 64,
    version: '',
    optimize: true,
    normalize: false,
    ligatures: false,
    inputDir: '',
    codepoints: null,
    codepointsFile: 'iconfonts-codepoints.json',
    startCodepoint: 0xF101,
    round: 10e12,
    dest: '',
    fontFilename: null,
    fontFamilyName: null,
    autoHint: true,
    dest: 'iconfonts/fonts',
    clean: true,
    types: optionToArray('eot,woff2,woff,ttf,svg'),
  }

  options = _.merge({}, defaultOptions, options);

  if(!options.fontFamilyName){
    options.fontFamilyName = options.font||'iconfonts';
  }

  if(!options.fontFilename){
    options.fontFilename = options.font||'iconfonts';
  }

  if(!_.isArray(options.types)){
    options.types = optionToArray(options.types, 'eot,woff2,woff,ttf,svg')
  }

  if(!options.codepoints){
    options.codepoints = {};
  }

  currentCodepoint = options.startCodepoint;

  //
  options.files = [];
  options.glyphs = [];
  options.rename = path.basename;
  // options.dest = path.join(__dirname, options.dest);

  //fs.mkdirsSync(options.dest);
  //
  if(options.clean){
    del.sync(options.dest);
  }

  fs.mkdirsSync(options.dest);

  /**
   * Check whether file is SVG or not
   *
   * @param {String} filepath File path
   * @return {Boolean}
   */
  function isSvgFile(filepath) {
    return path.extname(filepath).toLowerCase() === '.svg';
  }

  /**
   * Convert a string of comma separated words into an array
   *
   * @param {String} val Input string
   * @param {String} defVal Default value
   * @return {Array}
   */
  function optionToArray(val, defVal) {
    if (val === undefined) {
      val = defVal;
    }
    if (!val) {
      return [];
    }
    if (typeof val !== 'string') {
      return val;
    }
    return val.split(',').map(_.trim);
  }

  /**
   * Find next unused codepoint.
   *
   * @return {Integer}
   */
  function getNextCodepoint() {
    while (_.includes(options.codepoints, currentCodepoint)) {
      currentCodepoint++;
    }
    return currentCodepoint;
  }

  transform._transform = function(file, encoding, cb){
    if(isSvgFile(file.path)){
      let name = path.basename(file.path).replace(path.extname(file.path), '');
      options.files.push(file.path);
      options.glyphs.push(name);
      if(!options.codepoints[name]){
        options.codepoints[name] = getNextCodepoint();
      }
    }
    cb();
  }

  transform._flush = function(cb){
    fontforge(options, function(result){
      let codepoints = {};

      for(let name in options.codepoints){
        if(options.codepoints.hasOwnProperty(name)){
          codepoints[name] = {};
          codepoints[name]['unicode'] = options.codepoints[name];
          codepoints[name]['text'] = options.codepoints[name].toString(16);
        }
      }

      let codepointsFile = new gutil.File({
        base: __dirname,
        path: path.join(__dirname, options.codepointsFile),
        contents: new Buffer(JSON.stringify(codepoints))
      });

      this.push(codepointsFile);
      transform.emit('glyphs', codepoints);
    }.bind(this));
  }

  return transform;
}
