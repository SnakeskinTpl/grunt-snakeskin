/*
 * grunt-snakeskin
 * https://github.com/kobezzza/grunt-snakeskin
 *
 * Copyright (c) 2014 Kobezzza
 * Licensed under the MIT license.
 */

var path = require('path');
var snakeskin = require('snakeskin'),
	beautify = require('js-beautify');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var options = this.options(),
			prettyPrint;

		if (options.exec && options.prettyPrint) {
			options.prettyPrint = false;
			prettyPrint = true;
		}

		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;

				} else {
					return true;
				}

			}).map(function (filepath) {
				var tpls = {};

				if (options.exec) {
					options.context = tpls;
				}

				var res = snakeskin.compile(grunt.file.read(filepath), options, {file: filepath});

				if (options.exec) {
					res = snakeskin.returnMainTpl(tpls, filepath, options.tpl);
					res = res ? res(options.data) : '';
				}

				return res;

			}).join('');

			if (prettyPrint) {
				src = (beautify[path.extname(f.dest).replace(/^\./, '')] || beautify['html'])(src);
			}

			grunt.file.write(f.dest, src);
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});
};
