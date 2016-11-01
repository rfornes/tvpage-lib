module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['clean:js', 'requirejs', 'copy']
            },
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['clean:css', 'sass', 'copy:css']
            }
        },
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'build.js'
                }
            }
        },
        sass: {
            dist: {
                options: {
                    noCache: true,
                    sourcemap: false,
                    compas: true,
                    require: ['breakpoint', 'susy'],
                    style: 'expanded'
                },
                files: {
                    'dist/css-lib.css': 'src/scss/styles.scss'
                }
            }
        },
        clean: {
            js: 'dist/js-lib.tmpl',
            css: 'dist/css-lib.tmpl'
        },
        copy: {
            js: {
                cwd: './dist',
                expand: true,
                src: 'js-lib.tmpl',
                dest: 'templates/page'
            },
            css: {
                cwd: './dist',
                expand: true,
                src: 'css-lib.tmpl',
                dest: 'templates/page'
            }
        },
        autoprefixer: {
            css: {
                files: {
                    'dist/css-lib.css': 'dist/css-lib.css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-twig-render');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('js', ['clean:js', 'requirejs', 'copy', 'watch:js']);
    grunt.registerTask('css', ['clean:css', 'sass', 'autoprefixer', 'watch:css']);

};
