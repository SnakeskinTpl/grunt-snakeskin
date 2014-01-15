var grunt = require('grunt');
exports.snakeskin = {
	setUp: function (done) {
		done();
	},

	test: function (test) {
		test.expect(1);

		var tpl = require('../tmp/test.js').init(require('snakeskin'));
		var expected = grunt.file.read('test/expected/test');

		test.equal(tpl.child().trim(), expected, 'should describe what the custom option(s) behavior is.');
		test.done();
	}
};
