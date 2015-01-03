# [grunt](http://gruntjs.com/)-snakeskin

Using [Snakeskin](https://github.com/kobezzza/Snakeskin) templates with Grunt.

[![NPM version](http://img.shields.io/npm/v/grunt-snakeskin.svg?style=flat)](http://badge.fury.io/js/grunt-snakeskin)
[![NPM dependencies](http://img.shields.io/david/kobezzza/grunt-snakeskin.svg?style=flat)](https://david-dm.org/kobezzza/grunt-snakeskin)
[![Build Status](http://img.shields.io/travis/kobezzza/grunt-snakeskin.svg?style=flat&branch=master)](https://travis-ci.org/kobezzza/grunt-snakeskin)

## Install

```bash
npm install grunt-snakeskin --save-dev
```

## Usage

```js
module.exports = function (grunt) {
	grunt.initConfig({
		snakeskin: {
			compile: {
				options: {
					exec: true,
					prettyPrint: true
				},

				files: {
					'html/': ['test/fixtures/*.ss']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-snakeskin');
	grunt.registerTask('default', ['snakeskin']);
});
```

## [Options](https://github.com/kobezzza/Snakeskin/wiki/compile#opt_params)

### exec

Type: `Boolean`

Default: `false`

If the parameter is set to `true`, after compiling template will be launched and the results of its work will be saved.

### tpl

Type: `String`

The name of the executable template (if set `exec`), if the parameter is not specified, then uses the rule:

```js
%fileName% || main || index || Object.keys().sort()[0];
```

### data

Type: `?`

Data for the executable template (if set `exec`).

## [License](https://github.com/kobezzza/grunt-snakeskin/blob/master/LICENSE)

The MIT License.
