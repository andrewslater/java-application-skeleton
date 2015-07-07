module.exports = function(grunt) {

    grunt.initConfig({

        react: {
            jsx: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/main/webapp/resources/js/',
                        src: ['jsx/*.jsx'],
                        dest: 'src/main/webapp/resources/js/compiled/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify: {
            libraries: {
                files: {
                    'src/main/webapp/resources/minified/js/frontend-libraries.js': [
                        'src/main/webapp/resources/js/libraries/jquery.js',
                        'src/main/webapp/resources/js/libraries/jquery.i18n.properties.js',
                        'src/main/webapp/resources/js/libraries/jquery.caret.min.js',
                        'src/main/webapp/resources/js/libraries/bootstrap.js',
                        'src/main/webapp/resources/js/libraries/formValidation.js',
                        'src/main/webapp/resources/js/libraries/formValidation-bootstrap.js'

                    ],
                    'src/main/webapp/resources/minified/js/backend-libraries.js': [
                        'src/main/webapp/resources/js/libraries/react-with-addons.js',
                        'src/main/webapp/resources/js/hateoas.js'
                    ],
                    'src/main/webapp/resources/minified/js/application-core.js': [
                        'src/main/webapp/resources/js/application-core.js'
                    ]
                }
            }
        },

        sass: {
            libraries: {
                files: [{
                    expand: true,
                    cwd: 'src/main/resources/scss/',
                    src: ["*scss"],
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
                        'src/main/webapp/resources/css/font-awesome.css'
                    ],
                    'src/main/webapp/resources/minified/css/application-core.css': [
                        'src/main/webapp/resources/css/compiled/application-core.css'
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
        }
    });

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['react', 'uglify', 'sass', 'cssmin', 'copy']);
};
