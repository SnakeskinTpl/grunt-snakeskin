'use strict';

/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

const
	path = require('path'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync'),
	requireFromString = require('require-from-string');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		const
			ssrc = path.join(process.cwd(), '.snakeskinrc'),
			done = this.async(),
			tasks = [];

		let opts = this.options();
		if (!this.data.options && exists(ssrc)) {
			opts = snakeskin.toObj(ssrc);
		}

		opts = Object.assign({eol: '\n', dext: '.html'}, opts);

		const
			eol = opts.eol,
			nRgxp = /\r?\n|\r/g;

		opts.throws = true;
		opts.cache = false;

		let prettyPrint = opts.prettyPrint;
		if (opts.exec && opts.prettyPrint) {
			opts.prettyPrint = false;
			prettyPrint = true;
		}

		this.files.forEach((file) => {
			const
				isDir = !path.extname(file.dest);

			if (isDir) {
				file.src.forEach(f);

			} else {
				f(file.src[0]);
			}

			function f(src) {
				if (!grunt.file.exists(src)) {
					grunt.log.warn(`Source file "${src}" not found.`);
					return;
				}

				const
					content = grunt.file.read(src),
					p = Object.assign({}, opts),
					info = {file: src};

				let savePath = file.dest;
				if (isDir) {
					if (p.exec) {
						savePath = path.join(savePath, path.basename(src, path.extname(src)) + opts.dext);

					} else {
						savePath = path.join(savePath, `${path.basename(src)}.js`);
					}
				}

				function cb(err, res) {
					if (err) {
						grunt.fatal(err, 4);

					} else {
						grunt.file.write(savePath, res);
						grunt.log.writeln(`File "${savePath}" created.`);
					}
				}

				if (p.adapter || p.jsx) {
					return tasks.push(require(p.jsx ? 'ss2react' : p.adapter).adapter(content, p, info).then(
						(res) => {
							cb(null, res);
						},

						cb
					));
				}

				try {
					const
						tpls = {};

					if (p.exec) {
						p.module = 'cjs';
						p.context = tpls;
					}

					let res;
					// Do not compile, if source already compiled
					if(src.substr(src.length - 3) == '.js') {
						if(!p.exec) {
	          	grunt.fail.warn('Exec flag is not set for compiled template: ' + src + '\n')
						}
	          res = requireFromString(content)
	        }
	        else {
						res = snakeskin.compile(content, p, info);
	        }

					if (p.exec) {
						res = snakeskin.getMainTpl(tpls, info.file, p.tpl) || '';

						if (res) {
							return tasks.push(snakeskin.execTpl(res, p.data).then(
								(res) => {
									if (prettyPrint) {
										res = beautify.html(res);
									}

									cb(null, res.replace(nRgxp, eol) + eol);
								},

								cb
							));
						}
					}

					cb(null, res);

				} catch (err) {
					return cb(err);
				}
			}
		});

		Promise.all(tasks).then(done);
	});
};
