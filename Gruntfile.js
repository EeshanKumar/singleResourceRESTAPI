'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.initConfig({
		jshint: {
			dev: { src: [
				'Gruntfile.js', 
				'server.js', 
				'test/**/*.js', 
				'models/**/*.js',
				'routes/**/*.js'
			]},
			options: {
				node: true,
				globals: {
					describe: true,
					after: true,
					it: true,
					before: true,
					beforeEach: true
				}
			}
		}, 
		simplemocha: {
			dev: {src: ['test/**/*.js']},
			options: {timeout: 1000}
		}, 
		webpack: {
			client: {
				entry: './app/js/client.js',
				output: {
					path: 'build/',
					file: 'bundle.js'
				}
			},
			test: {
				entry: './test/client/test.js',
				output: {
					path: 'test/client',
					file: 'test_bundle.js'
				}
			},
		},
		copy: {
			html: {
				cwd: 'app/',
				expand: true,
				flatten: false,
				src: '**/*.html',
				dest: 'build/',
				filter: 'isFile'
			}
		},
		clean: {
			dev: {
				src: 'build/'
			}
		}
	});

	grunt.registerTask('linter', ['jshint:dev']);
	grunt.registerTask('test', ['simplemocha:dev']);
	grunt.registerTask('clientTest', ['webpack:test']);
	grunt.registerTask('build', ['webpack:client', 'copy:html']);
	grunt.registerTask('cleanup', ['clean:dev']);
	grunt.registerTask('default', ['linter', 'test']);
};