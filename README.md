# examples-svg-to-font
Automatically generate icon font

## Installation
### OS X
```
brew install ttfautohint fontforge --with-python
```

*You may need to use `sudo` for `brew`, depending on your setup.*

*`fontforge` isn’t required for `node` engine (see below).*

### Linux
```
sudo apt-get install fontforge ttfautohint
```

*`fontforge` isn’t required for the `node` engine (see [below](#available-engines)).*

### Windows
Then [install `ttfautohint`](http://www.freetype.org/ttfautohint/#download) (optional).

Then install `fontforge`.
* Download and install [fontforge](http://fontforge.github.io/en-US/downloads/windows/).
* Add `C:\Program Files (x86)\FontForgeBuilds\bin` to your `PATH` environment variable.

*`fontforge` isn’t required for the `node` engine (see [below](#available-engines)).*

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
