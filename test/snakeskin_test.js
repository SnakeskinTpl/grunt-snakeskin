/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

var grunt = require('grunt');
exports.snakeskin = {
	setUp: function (done) {
		done();
	},

	test: function (test) {
		test.expect(3);

		var
			js = require('../tmp/test.js'),
			html = grunt.file.read('tmp/test.html'),
			vue = grunt.file.read('tmp/vue.js').replace(/\/\*[\s\S]*?\*\/\s*/, '');

		test.equal(html, grunt.file.read('test/expected/test'), 'renderMode: html');
		test.equal(js.child.child({name: 'world'}), grunt.file.read('test/expected/test2').trim(), 'renderMode: js');
		test.equal(vue, grunt.file.read('test/expected/vue'), 'adapter: ss2vue');

		test.done();
	}
};
