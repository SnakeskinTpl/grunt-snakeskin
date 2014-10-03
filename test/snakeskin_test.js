var grunt = require('grunt');
exports.snakeskin = {
	setUp: function (done) {
		done();
	},

	test: function (test) {
		test.expect(2);

		var js = require('../tmp/test.js').init(require('snakeskin')),
			html = grunt.file.read('tmp/test.html');

		var expected1 = grunt.file.read('test/expected/test')
				.replace(/\r\n/gm, '\n').trim(),

			expected2 = grunt.file.read('test/expected/test2')
				.replace(/\r\n/gm, '\n').trim();

		test.equal(html.trim(), expected1, 'renderMode: html');
		test.equal(js.child({name: 'world'}).trim(), expected2, 'renderMode: js');

		test.done();
	}
};
