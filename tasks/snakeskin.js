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
			opts = this.options();

		if (!this.data.options && exists(ssrc)) {
			opts = snakeskin.toObj(ssrc);
		}

		opts = Object.assign(
			{
				module: 'umd',
				moduleId: 'tpls',
				useStrict: true,
				eol: '\n'
			},

			opts
		);

		var
			eol = opts.eol,
			mod = opts.module,
			useStrict = opts.useStrict ? '"useStrict";' : '',
			prettyPrint = opts.prettyPrint,
			nRgxp = /\r?\n|\r/g;

		opts.throws = true;
		opts.cache = false;

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
					params.module = 'cjs';
					params.doctype = 'strict';
				}

				try {
					res = snakeskin.compile(grunt.file.read(src), params, {file: src});
					var testId = function (id) {
						try {
							var obj = {};
							eval('obj.' + id + '= true');
							return true;

						} catch (ignore) {
							return false;
						}
					};

					var compileJSX = function (tpls, prop) {
						prop = prop || 'exports';
						$C(tpls).forEach(function (el, key) {
							var
								val,
								validKey = false;

							if (testId(key)) {
								val = prop + '.' + key;
								validKey = true;

							} else {
								val = prop + '["' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]';
							}

							if (typeof el !== 'function') {
								res +=
									'if (' + val + ' instanceof Object === false) {' +
										val + ' = {};' +
										(validKey && mod === 'native' ? 'export var ' + key + '=' + val + ';' : '') +
									'}'
								;

								return compileJSX(el, val);
							}

							var
								decl = /function .*?\)\s*\{/.exec(el.toString()),
								text = el(opts.data);

							text = val + ' = ' + decl[0] + (/\breturn\s+\(?\s*[{<](?!\/)/.test(text) ? '' : 'return ') + text + '};';
							res += babel.transform(text, {
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
						res = /\/\*[\s\S]*?\*\//.exec(res)[0];

						if (mod === 'native') {
							res +=
								useStrict +
								'import React from "react";' +
								'var exports = {};' +
								'export default exports;'
							;

						} else {
							res +=
								'(function(global, factory) {' +
									(
										{cjs: true, umd: true}[mod] ?
											'if (typeof exports === "object" && typeof module !== "undefined") {' +
												'factory(exports, typeof React === "undefined" ? require("react") : React);' +
												'return;' +
											'}' :
											''
									) +

									(
										{amd: true, umd: true}[mod] ?
											'if (typeof define === "function" && define.amd) {' +
												'define("' + (opts.moduleId) + '", ["exports", "react"], factory);' +
												'return;' +
											'}' :
											''
									) +

									(
										{global: true, umd: true}[mod] ?
											'factory(global' + (opts.moduleName ? '.' + opts.moduleName + '= {}' : '') + ', React);' :
											''
									) +

								'})(this, function (exports, React) {' +
									useStrict
							;
						}

						compileJSX(tpls);
						if (mod !== 'native') {
							res += '});';
						}

						if (prettyPrint) {
							res = beautify.js(res);
						}

						res = res.replace(nRgxp, eol) + eol;

					} else if (params.exec) {
						res = snakeskin.getMainTpl(tpls, src, params.tpl) || '';

						if (res) {
							res = res(params.data);

							if (prettyPrint) {
								res = beautify.html(res);
							}

							res = res.replace(nRgxp, eol) + eol;
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
