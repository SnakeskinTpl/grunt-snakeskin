/*
 * grunt-snakeskin
 * https://github.com/kobezzza/grunt-snakeskin
 *
 * Copyright (c) 2014 Kobezzza
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var options = this.options();

		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;

				} else {
					return true;
				}

			}).map(function (filepath) {
				return require('snakeskin').compile(grunt.file.read(filepath), options, {file: filepath});

			}).join('');

			grunt.file.write(f.dest, src);
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});
};
