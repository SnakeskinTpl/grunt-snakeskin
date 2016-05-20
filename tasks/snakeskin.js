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
	babel = require('babel-core'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var
			ssrc = path.join(process.cwd(), '.snakeskinrc'),
			opts = this.options(),
			prettyPrint;

		if (!this.data.options && exists(ssrc)) {
			opts = snakeskin.toObj(ssrc);
		}

		opts = opts || {};
		opts.throws = true;
		opts.cache = false;
		var n = opts.eol = opts.eol || '\n';

		if (opts.jsx) {
			opts.literalBounds = ['{', '}'];
			opts.renderMode = 'stringConcat';
			opts.exec = false;

		} else if (opts.exec && opts.prettyPrint) {
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
					tpls = {},
					res = '';

				if (params.exec || opts.jsx) {
					params.context = tpls;
				}

				try {
					res = snakeskin.compile(grunt.file.read(src), params, {file: src});
					var compileJSX = function (tpls, prop) {
						prop = prop || 'exports';
						$C(tpls).forEach(function (el, key) {
							var val = prop + '["' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]';

							if (typeof el !== 'function') {
								res += 'if (' + val + ' instanceof Object === false) {' + n + '\t' + val + ' = {};' + n + '}' + n + n;
								return compileJSX(el, val);
							}

							var decl = /function .*?\)\s*\{/.exec(el.toString());
							res += babel.transform(val + ' = ' + decl[0] + ' ' + el(opts.data) + '};', {
								babelrc: false,
								plugins: [
									require('babel-plugin-syntax-jsx'),
									require('babel-plugin-transform-react-jsx'),
									require('babel-plugin-transform-react-display-name')
								]
							}).code;
						});
					};

					if (opts.jsx) {
						res = '';
						compileJSX(tpls);

					} else if (params.exec) {
						res = snakeskin.getMainTpl(tpls, src, params.tpl) || '';

						if (res) {
							res = res(params.data);

							if (prettyPrint) {
								res = beautify['html'](res);
								res = res.replace(/\r?\n|\r/g, n);
							}

							res += n;
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
