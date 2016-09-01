module.exports = function(grunt) {
  grunt.initConfig({
    watch : {
      templates : {
        files : ['templates/**'],
        tasks : ['twigRender']
      },
      'lib-js' : {
        files : ['src/**/*.js'],
        tasks : ['clean:lib-js','requirejs','copy']
      },
      'lib-css' : {
        files : ['src/**/*.scss'],
        tasks : ['clean:lib-css','sass','copy:lib-css']
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
          require: ['breakpoint'],
          style: 'expanded'
        },
        files: {
          'dist/tvpage-css.tmpl' : 'src/tvpage.scss'
        }
      }
    },
    clean: {
      'lib-js': 'dist/tvpage-js.tmpl',
      'lib-css': 'dist/tvpage-css.tmpl',
      templates: ['templates/page','templates/cartridge']
    },
    copy: {
      'lib-js': {
        cwd: './dist',
        expand: true,
        src: 'tvpage-js.tmpl',
        dest: 'templates/page'
      },
      'lib-css': {
        cwd: './dist',
        expand: true,
        src: 'tvpage-css.tmpl',
        dest: 'templates/page'
      }
    },
    autoprefixer:{
      css:{
        files: {    
          'dist/tvpage-css.tmpl':'dist/tvpage-css.tmpl'
        }
      }
    },
    twigRender: {
      templates: {
        files : [
          {
            data: 'twig-code.json',
            expand: true,
            cwd: 'templates/',
            src: ['**/*.twig', '!**/_*.twig', '!base.twig', '!classic.twig', '!grid-layout.twig','!meta.twig'],
            dest: 'templates/page/',
            ext: '.tmpl'
          }
        ]
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-twig-render');
  
  // grunt.registerTask('lib-css',['clean:lib-css','sass','autoprefixer','copy:lib-css','watch:lib-css']);
  // grunt.registerTask('lib-js',['clean:lib-js','requirejs','copy:lib-js','watch:lib-js']);
  // grunt.registerTask('templates',['clean:templates','jade','watch:templates']);

  grunt.registerTask('templates',['clean:templates','twigRender','watch:templates']);

};