/*
 * grunt-snakeskin
 * https://github.com/kobezzza/grunt-snakeskin
 *
 * Copyright (c) 2014 Kobezzza
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],

			options: {
				jshintrc: '.jshintrc'
			}
		},

		clean: {
			tests: ['tmp']
		},

		snakeskin: {
			test: {
				options: {
					exports: 'commonJS',
					prettyPrint: true
				},

				files: {
					'tmp/test.js': ['test/fixtures/base.ss', 'test/fixtures/child.ss']
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
					'tmp/test.html': ['test/fixtures/base.ss', 'test/fixtures/child.ss']
				}
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'snakeskin', 'nodeunit']);
	grunt.registerTask('default', ['jshint', 'test']);
};
