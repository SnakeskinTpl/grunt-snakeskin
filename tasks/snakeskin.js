/*
 * grunt-snakeskin
 * https://github.com/kobezzza/grunt-snakeskin
 *
 * Copyright (c) 2014 kobezzza
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

		options.throws = true;
		options.cache = false;
		options.lineSeparator = options.lineSeparator || '\n';

		this.files.forEach(function (f) {
			var isDir = !path.extname(f.dest);
			var src = f.src.filter(function (filepath) {
				if (grunt.file.exists(filepath)) {
					return true;
				}

				grunt.log.warn('Source file "' + filepath + '" not found.');
				return false;

			}).map(function (filepath) {
				var tpls = {},
					res = '';

				if (options.exec) {
					options.context = tpls;
				}

				try {
					res = snakeskin.compile(grunt.file.read(filepath), options, {file: filepath});

					if (options.exec) {
						res = snakeskin.returnMainTpl(tpls, filepath, options.tpl) || '';

						if (res) {
							res = res(options.data);

							if (prettyPrint) {
								res = beautify['html'](res);
								res = res.replace(/\r?\n|\r/g, options.lineSeparator);
							}

							res += options.lineSeparator;
						}
					}

					if (isDir) {
						var savePath;

						if (options.exec) {
							savePath = path.basename(filepath, path.extname(filepath)) + '.html';

						} else {
							savePath = path.basename(filepath) + '.js';
						}

						grunt.file.write(
							path.join(f.dest, savePath),
							res
						);

						grunt.log.writeln('File "' + f.dest + '" created.');
					}

				} catch (err) {
					grunt.log.error(err.message);
				}

				return res;

			}).join('');

			if (!isDir) {
				grunt.file.write(f.dest, src);
				grunt.log.writeln('File "' + f.dest + '" created.');
			}
		});
	});
};
