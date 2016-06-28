/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

require('core-js/es6/object');
require('core-js/es6/promise');

var
	path = require('path'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (grunt) {
	grunt.registerMultiTask('snakeskin', 'Compile Snakeskin templates', function () {
		var
			ssrc = path.join(process.cwd(), '.snakeskinrc'),
			opts = this.options(),
			done = this.async(),
			tasks = [];

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

		this.files.forEach(function (file) {
			var
				src = file.src[0];

			if (!grunt.file.exists(src)) {
				grunt.log.warn('Source file "' + src + '" not found.');
				return;
			}

			var
				content = grunt.file.read(src),
				savePath = file.dest;

			var
				p = Object.assign({}, opts),
				info = {file: src};

			if (!path.extname(savePath)) {
				if (p.exec) {
					savePath = path.join(savePath, path.basename(src, path.extname(src)) + '.html');

				} else {
					savePath = path.join(savePath, path.basename(src) + '.js');
				}
			}

			function cb(err, res) {
				if (err) {
					grunt.log.error(err.message);

				} else {
					grunt.file.write(savePath, res);
					grunt.log.writeln('File "' + file.dest + '" created.');
				}
			}

			if (p.adapter || p.jsx) {
				return tasks.push(require(p.jsx ? 'ss2react' : p.adapter).adapter(content, p, info).then(
					function (res) {
						cb(null, res);
					},

					cb
				));
			}

			try {
				var tpls = {};

				if (p.exec) {
					p.module = 'cjs';
					p.context = tpls;
				}

				var res = snakeskin.compile(content, p, info);

				if (p.exec) {
					res = snakeskin.getMainTpl(tpls, info.file, p.tpl) || '';

					if (res) {
						return tasks.push(snakeskin.execTpl(res, p.data).then(
							function (res) {
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
		});

		Promise.all(tasks).then(done);
	});
};
