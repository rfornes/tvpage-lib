// Build docs: https://github.com/jrburke/r.js/blob/master/build/example.build.js
requirejs.config({
  baseUrl: './',
  paths: {
    jquery: 'vendor/jquery'
  },
  name: 'vendor/almond',
  optimize: 'none',
  exclude: ['jquery'],
  include: ['src/tvpage'],
  wrap: {
    start: "(function(root,factory) {\n"+   
           "  if (typeof define === 'function' && define.amd) {\n"+   
           "    define(['jquery'], factory);\n"+
           "  } else {\n"+
           "    root.tvpage = factory(root.$);\n"+
           "  }\n"+
           "}(this,function($){\n",

    end:   "  define('jquery',function(){ return $; });\n"+
           "  return require('src/tvpage');\n"+
           "}));\n"
  },
  out: './dist/tvpage-js.tmpl'
})