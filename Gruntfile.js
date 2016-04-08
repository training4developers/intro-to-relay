module.exports = function(grunt) {

	"use strict";

	grunt.initConfig({
		webServer: {
			folder: "dist/www",
			port: 8080
		},
		mongoServer: {
			host: "localhost",
			port: 27017,
			dbName: "t4dclass"
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: "./src",
						src: ["*.json"],
						dest: "./dist"
					},
					{
						expand: true,
						cwd: "./src/www",
						src: ["*.html"],
						dest: "./dist/www"
					}
				]
			}
		},
		babel: {
			options: {
				presets: ["es2015"]
			},
			js: {
				files: [{
					expand: true,
					cwd: "src",
					src: ["**/*.js","!www/**"],
					dest: "dist",
					ext: ".js"
				}]
			}
		},
		webpack: {
			app: {
				entry: "./src/www/js/index.js",
				output: {
					path: "./dist/www/js",
					filename: "index.js"
				},
				module: {
					loaders: [{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: "babel-loader",
						query: {
							passPerPreset: true,
							presets: [{
					      "plugins": [ "./build/babelRelayPlugin" ]
					    }, "react", "es2015", "stage-0"]
						}
					}]
				}
			}
		},

		watch: {
			copy: {
				files: ["src/*.json","src/www/*.html"],
				tasks: ["copy"]
			},
			babel: {
				files: ["src/**/*.js","!src/www/**"],
				tasks: ["babel"]
			},
			webpack: {
				files: ["src/www/**/*.js","src/www/**/*.jsx"],
				tasks: ["webpack"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-webpack");

	grunt.registerTask("server", function() {
		let server = require("./dist/server");
		server.default(grunt.config());
		this.async();
	});

	grunt.registerTask("default", [
		"copy", "babel", //"webpack"
	]);

}
