[grunt](http://gruntjs.com/)-snakeskin
======================================

Using [Snakeskin](https://github.com/SnakeskinTpl/Snakeskin) templates with Grunt.

[![NPM version](http://img.shields.io/npm/v/grunt-snakeskin.svg?style=flat)](http://badge.fury.io/js/grunt-snakeskin)
[![Build Status](http://img.shields.io/travis/SnakeskinTpl/grunt-snakeskin.svg?style=flat&branch=master)](https://travis-ci.org/SnakeskinTpl/grunt-snakeskin)
[![NPM dependencies](http://img.shields.io/david/SnakeskinTpl/grunt-snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/grunt-snakeskin)
[![NPM devDependencies](http://img.shields.io/david/dev/SnakeskinTpl/grunt-snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/grunt-snakeskin?type=dev)
[![NPM peerDependencies](http://img.shields.io/david/peer/SnakeskinTpl/grunt-snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/grunt-snakeskin?type=peer)

## Install

```bash
npm install grunt-snakeskin --save-dev
```

## Usage

**Gruntfile.js**

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
};
```

## [Options](http://snakeskintpl.github.io/docs/api.html#compile--opt_params)
### adapter

Type: `String`

Name of the adaptor, for example:

* [ss2react](https://github.com/SnakeskinTpl/ss2react) compiles Snakeskin for React
* [ss2vue](https://github.com/SnakeskinTpl/ss2vue) compiles Snakeskin for Vue2

### adapterOptions

Type: `Object`

Options for the used adaptor.

### exec

Type: `Boolean`

Default: `false`

If the parameter is set to `true` the template will be launched after compiling and the results of it work will be saved.

### dext

Type: `String`

Default: `'.html'`

Extension of a file with result after template execution (using with `exec`).

### tpl

Type: `String`

The name of the executable template (if is set `exec`), if the parameter is not specified, then uses the rule:

```js
%fileName% || main || index || Object.keys().sort()[0];
```

### data

Type: `?`

Data for the executable template (if is set `exec`).

## [License](https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE)

The MIT License.
