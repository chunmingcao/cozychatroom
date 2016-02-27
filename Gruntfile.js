module.exports = function(grunt) {
    
  // configurable paths
  var config = {
    dist: 'dist/'
  };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['src/**/*.js', 'public/**/*.js']
        },
        jsbeautifier: {
            files: ['src/**/*.js', 'public/**/*.js', "public/**/*.html", "public/**/*.css"]
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
        clean: ["dist/**"],
        open: {
          chatroom: {
            url: 'http://localhost:' + (process.env.PORT || '3000') + '/chatroom'
          }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open'); 
    
    // Default task(s).
    grunt.registerTask('build', ['clean', 'jshint', 'jsbeautifier', 'copy', 'uglify']);
    grunt.registerTask('dev', ['build', 'express', 'open', 'watch']);
    grunt.registerTask('server', ['express:dev', 'open', 'watch']);
    grunt.registerTask('default', ['dev']);
    
};
