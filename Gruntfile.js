'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

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
		webpack: {
			client: {
				entry: './app/js/client.js',
				output: {
					path: 'build/',
					file: 'bundle.js'
				}
			}
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
			dev: {rm 
				src: 'build/'
			}
		},
		watch: {
			files: ['./app/**/*.js', './app/**/*.html'],
			tasks: ['build']
		}
	});

	grunt.registerTask('linter', ['jshint:dev']);
	grunt.registerTask('test', []);
	grunt.registerTask('build', ['webpack:client', 'copy:html']);
	grunt.registerTask('cleanup', ['clean:dev']);
	grunt.registerTask('default', ['linter', 'test']);
};