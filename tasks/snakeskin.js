/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

require('core-js/es6/object');

var
	$C = require('collection.js').$C;

var
	path = require('path'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var
			ssrc = path.join(process.cwd(), '.snakeskinrc'),
			opts = this.options();

		if (!this.data.options && exists(ssrc)) {
			opts = snakeskin.toObj(ssrc);
		}

		opts = Object.assign({eol: '\n'}, opts);

		var
			eol = opts.eol,
			prettyPrint = opts.prettyPrint,
			nRgxp = /\r?\n|\r/g;

		opts.throws = true;
		opts.cache = false;

		if (opts.exec && opts.prettyPrint) {
			opts.prettyPrint = false;
			prettyPrint = true;
		}

		function filter(src) {
			if (grunt.file.exists(src)) {
				return true;
			}

			grunt.log.warn('Source file "' + src + '" not found.');
			return false;
		}

		$C(this.files).forEach(function (file) {
			var
				isDir = !path.extname(file.dest);

			function map(src) {
				var
					params = Object.assign({}, opts),
					res = '';

				try {
					if (opts.jsx) {
						res = snakeskin.compileAsJSX(grunt.file.read(src), params, {file: src});

					} else {
						var tpls = {};

						if (params.exec || opts.jsx) {
							params.context = tpls;
							params.module = 'cjs';
						}

						res = snakeskin.compile(grunt.file.read(src), params, {file: src});

						if (params.exec) {
							res = snakeskin.getMainTpl(tpls, src, params.tpl) || '';

							if (res) {
								res = res(params.data);

								if (prettyPrint) {
									res = beautify.html(res);
								}

								res = res.replace(nRgxp, eol) + eol;
							}
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
				grunt.file.write(file.dest, $C(file.src).map(map, {filter: filter}).join(''));
				grunt.log.writeln('File "' + file.dest + '" created.');
			}
		});
	});
};
