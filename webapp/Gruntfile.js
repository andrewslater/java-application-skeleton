module.exports = function(grunt) {

    var webpack = require("webpack");
    var webpackConfig = require("./webpack-config.js");

    grunt.initConfig({

        sass: {
            libraries: {
                files: [{
                    expand: true,
                    cwd: 'src/main/resources/scss/',
                    src: ["application-core.scss", "spinkit/spinkit.scss"],
                    dest: "src/main/webapp/resources/css/compiled",
                    ext: ".css"
                }]
            }
        },

        cssmin: {
            libraries: {
                files: {
                    'src/main/webapp/resources/minified/css/application-libraries.css' : [
                        'src/main/webapp/resources/css/bootstrap.css',
                        'src/main/webapp/resources/css/bootstrap-theme.css',
                        'src/main/webapp/resources/css/awesome-bootstrap-checkbox.css',
                        'src/main/webapp/resources/css/formValidation.css',
                        'src/main/webapp/resources/css/font-awesome.css',
                        'src/main/webapp/resources/css/spinkit.css',
                        'src/main/webapp/resources/css/animate.css'
                    ],
                    'src/main/webapp/resources/minified/css/application-core.css': [
                        'src/main/webapp/resources/css/compiled/**/*.css'
                    ]
                }
            }
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/main/webapp/resources/fonts/',
                        src: ["**"],
                        dest: "src/main/webapp/resources/minified/fonts"
                    }
                ]
            }
        },

        webpack: {
            options: webpackConfig,
            build: {
                plugins: webpackConfig.plugins.concat(
                    new webpack.DefinePlugin({
                        "process.env": {
                            // This has effect on the react lib size
                            "NODE_ENV": JSON.stringify("production")
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin()
                )
            },
            "build-dev": {
                devtool: "sourcemap",
                debug: true
            }
        },

        "webpack-dev-server": {
            options: {
                webpack: webpackConfig,
                publicPath: "http://localhost:9090/" + webpackConfig.output.publicPath,
                port: 9090
            },
            start: {
                keepAlive: true,
                webpack: {
                    devtool: "eval",
                    debug: true
                }
            }
        },

        watch: {
            app: {
                files: ["app/**/*", "web_modules/**/*"],
                tasks: ["webpack:build-dev"],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['webpack:build', 'copy']);
    grunt.registerTask('watchjs', ["webpack-dev-server:start"]);
};
