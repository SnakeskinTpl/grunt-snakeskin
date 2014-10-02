var grunt = require('grunt');
exports.snakeskin = {
	setUp: function (done) {
		done();
	},

	test: function (test) {
		test.expect(2);

		var js = require('../tmp/test.js').init(require('snakeskin')),
			html = grunt.file.read('tmp/test.html'),
			expected = grunt.file.read('test/expected/test');

		test.equal(js.child().trim(), expected, 'renderMode: js');
		test.equal(html.trim(), expected, 'renderMode: html');

		test.done();
	}
};
