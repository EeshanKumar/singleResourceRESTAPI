'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');

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
		}
	});

	grunt.registerTask('linter', ['jshint:dev']);
	grunt.registerTask('test', 'simplemocha:dev');
	grunt.registerTask('default', ['linter', 'test']);
};