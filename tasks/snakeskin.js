/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

require('core-js/es6/object');

var
	path = require('path'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var
			ssrc = path.join(process.cwd(), '.snakeskinrc'),
			options = this.options();

		if (!options && exists(ssrc)) {
			options = snakeskin.toObj(ssrc);
		}

		options = options || {};
		options.throws = true;
		options.cache = false;
		options.eol = options.eol || '\n';

		var
			prettyPrint;

		if (options.exec && options.prettyPrint) {
			options.prettyPrint = false;
			prettyPrint = true;
		}

		function filter(src) {
			if (grunt.file.exists(src)) {
				return true;
			}

			grunt.log.warn('Source file "' + src + '" not found.');
			return false;
		}

		this.files.forEach(function (file) {
			var
				isDir = !path.extname(file.dest);

			function map(src) {
				var
					params = Object.assign({}, options),
					tpls = {},
					res = '';

				if (params.exec) {
					params.context = tpls;
				}

				try {
					res = snakeskin.compile(grunt.file.read(src), params, {file: src});

					if (params.exec) {
						res = snakeskin.getMainTpl(tpls, src, params.tpl) || '';

						if (res) {
							res = res(params.data);

							if (prettyPrint) {
								res = beautify['html'](res);
								res = res.replace(/\r?\n|\r/g, params.eol);
							}

							res += params.eol;
						}
					}

					if (isDir) {
						var savePath;

						if (params.exec) {
							savePath = path.basename(src, path.extname(src)) + '.html';

						} else {
							savePath = path.basename(src) + '.js';
						}

						grunt.file.write(
							path.join(file.dest, savePath),
							res
						);

						grunt.log.writeln('File "' + file.dest + '" created.');
					}

				} catch (err) {
					grunt.log.error(err.message);
				}

				return res;
			}

			if (!isDir) {
				grunt.file.write(file.dest, file.src.map(map, {filter: filter}).join(''));
				grunt.log.writeln('File "' + file.dest + '" created.');
			}
		});
	});
};
