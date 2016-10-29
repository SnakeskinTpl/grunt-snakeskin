'use strict';

/*!
 * grunt-snakeskin
 * https://github.com/SnakeskinTpl/grunt-snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/grunt-snakeskin/blob/master/LICENSE
 */

module.exports = function (grunt) {
	grunt.initConfig({
		clean: {
			tests: ['tmp']
		},

		snakeskin: {
			test: {
				options: {
					prettyPrint: true
				},

				files: {
					'tmp/test.js': ['test/fixtures/child.ss']
				}
			},

			test2: {
				options: {
					exec: true,
					prettyPrint: true,
					data: {
						name: 'world'
					}
				},

				files: {
					'tmp/test.html': ['test/fixtures/child.ss']
				}
			},

			test3: {
				options: {
					adapter: 'ss2vue',
					prettyPrint: true
				},

				files: {
					'tmp/vue.js': ['test/fixtures/vue.ss']
				}
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'snakeskin', 'nodeunit']);
	grunt.registerTask('default', ['test']);
};
