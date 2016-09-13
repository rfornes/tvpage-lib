var Generator = require('./generator');

module.exports = function(grunt) {

  grunt.initConfig({
    watch : {
      templates : {
        files : ['gruntfile.js','src/views/**/*.twig'],
        tasks : ['twigRender', 'jsbeautifier']
      },
      'lib-js' : {
        files : ['src/js/**/*.js'],
        tasks : ['clean:lib-js','requirejs','copy']
      },
      'lib-css' : {
        files : ['src/scss/**/*.scss'],
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
          require: ['breakpoint','susy'],
          style: 'expanded'
        },
        files: {
          'dist/tvpage-css.css' : 'src/scss/tvpage.scss'
        }
      }
    },
    clean: {
      'lib-js': 'dist/tvpage-js.tmpl',
      'lib-css': 'dist/tvpage-css.tmpl',
      templates: ['templates/page/*.tmpl','templates/cartridge/*.tmpl', '!templates/page/tvpage-js.tmpl']
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
          'dist/tvpage-css.css':'dist/tvpage-css.css'
        }
      }
    },
    twigRender: {
      options: {
        extensions:[
          function(Twig){
            Twig.exports.extendFunction('cartridge',function(name,options){
              return Generator.generate(name,options);
            });
            Twig.exports.extendFunction('widget',function(name,options){
              return Generator.generate(name,options,true);
            });
          },
        ]
      },
      pages: {
        files : [
          {
            data: 'twig-code.json',
            expand: true,
            cwd: 'src/views/page',
            src: ['**/*.twig', '!**/_*.twig', '!base.twig','!meta.twig'],
            dest: 'templates/page/',
            ext: '.tmpl'
          }
        ]
      }
    },
    jsbeautifier: {
      files: ["templates/**/*.tmpl", "!templates/page/tvpage-js.tmpl"],
      options: {
        html: {
          indentChar: " ",
          indentSize: 2,
          preserveNewlines: false,
          noPreserveNewlines: true,
          indentInnerHtml: true,
          wrapAttributes: 'force-aligned',
          extraLiners: ['script','section']
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

  grunt.registerTask('lib-js',['clean:lib-js','requirejs','copy','watch:lib-js']);
  grunt.registerTask('lib-css',['clean:lib-css','sass','autoprefixer','watch:lib-css']);
  grunt.registerTask('lib-templates',['clean:templates','twigRender','jsbeautifier','watch:templates']);

};