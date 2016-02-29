module.exports = function(grunt) {

    // configurable paths
    var config = {
        dist: 'dist/'
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                node: true
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'public/**/*.js']
        },
        jsbeautifier: {
            files: ['Gruntfile.js', 'src/**/*.js', 'public/**/*.js', "public/**/*.html", "public/**/*.css"]
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: config.dist + '/public/javascripts/chatroomclient.js',
                dest: config.dist + '/public/javascripts/chatroomclient.js'
            }
        },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: './dist/bin/www'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            express: {
                files: ['src/**/*.js'],
                tasks: ['copy:src', 'express:dev'],
                options: {
                    spawn: false
                }
            },
            public: {
                files: ["public/stylesheets/*.css", "public/javascripts/*.js"],
                tasks: ['copy:public']
            }
        },
        copy: {
            src: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**',
                    dest: config.dist,
                }]
            },
            test: {
                files: [{
                    expand: true,
                    src: 'test/**',
                    dest: config.dist,
                }]
            },
            public: {
                files: [{
                    expand: true,
                    src: 'public/**',
                    dest: config.dist,
                }]
            },
            others: {
                files: [{
                    expand: true,
                    src: 'bin/**',
                    dest: config.dist,
                }]
            }
        },
        clean: {
            dev: {
                src: ['dist/**']
            },
            coverage: {
                src: ['coverage/**']
            }
        },
        open: {
            chatroom: {
                url: 'http://localhost:' + (process.env.PORT || '3000') + '/chatroom'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    /*captureFile: 'test/results.txt', */ //Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/*.js']
            }
        },

        // start - code coverage settings
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../coverage/instrument/dist/bin/'
            }
        },

        instrument: {
            files: ['dist/*.js', 'dist/routes/*.js', 'dist/models/*.js', 'dist/bin/*'],
            options: {
                lazy: true,
                basePath: 'coverage/instrument/'
            }
        },

        storeCoverage: {
            options: {
                dir: 'coverage/reports'
            }
        },

        makeReport: {
            src: 'coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage/reports',
                print: 'detail'
            }
        }
        // end - code coverage settings

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('build', ['clean:dev', 'jshint', 'jsbeautifier', 'copy', 'uglify']);
    grunt.registerTask('dev', ['build', 'express', 'open', 'watch']);
    grunt.registerTask('server', ['express:dev', 'open', 'watch']);
    // Default task(s).
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['clean:coverage', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);
};
