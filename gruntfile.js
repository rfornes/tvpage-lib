var Gen = require('./templates/generator');

module.exports = function(grunt) {

  grunt.initConfig({
    watch : {
      templates : {
        files : ['gruntfile.js','templates/views/**/*.twig'],
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
          require: ['breakpoint','susy'],
          style: 'expanded'
        },
        files: {
          'dist/tvpage-css.css' : 'src/tvpage.scss'
        }
      }
    },
    clean: {
      'lib-js': 'dist/tvpage-js.tmpl',
      'lib-css': 'dist/tvpage-css.tmpl',
      templates: ['templates/page/*.tmpl','templates/cartridge/*.tmpl']
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
            Twig.exports.extendFunction('cartridge',function(name){
              return "{{ tvsite_cartridge_idstring(\""+name+"\")}}";
            });
          },
          function(Twig){
            Twig.exports.extendFunction('widget',function(entity, options){
              return Gen.generate(options.component,entity,options);
            });
          }
        ]
      },
      pages: {
        files : [
          {
            data: 'twig-code.json',
            expand: true,
            cwd: 'templates/views/page',
            src: ['**/*.twig', '!**/_*.twig', '!base.twig','!meta.twig'],
            dest: 'templates/page/',
            ext: '.tmpl'
          }
        ]
      },
      cartridges: {
        files : [
          {
            data: 'twig-code.json',
            expand: true,
            cwd: 'templates/views/cartridge/',
            src: ['**/*.twig', '!**/_*.twig', '!macros.twig'],
            dest: 'templates/cartridge/',
            ext: '.tmpl'
          }
        ]
      }
    },
    htmlmin: {
      templates: {
        options: { 
          removeComments: false,
          collapseWhitespace: true,
          conservativeCollapse: true
        },
        files: {
          'templates/page/channel.tmpl': 'templates/page/channel.tmpl',
          'templates/page/home.tmpl': 'templates/page/home.tmpl',
          'templates/page/playback.tmpl': 'templates/page/playback.tmpl' 
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
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('lib-css',['clean:lib-css','sass','autoprefixer','watch:lib-css']);
  grunt.registerTask('lib-templates',['clean:templates','twigRender', 'htmlmin', 'watch:templates']);

};