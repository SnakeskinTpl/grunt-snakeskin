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
		test.expect(2);

		var
			js = require('../tmp/test.js').init(require('snakeskin')),
			html = grunt.file.read('tmp/test.html');

		var
			expected1 = grunt.file.read('test/expected/test'),
			expected2 = grunt.file.read('test/expected/test2').trim();

		test.equal(html, expected1, 'renderMode: html');
		test.equal(js.child({name: 'world'}), expected2, 'renderMode: js');

		test.done();
	}
};
