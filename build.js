// https://github.com/jrburke/r.js/blob/master/build/example.build.js
requirejs.config({
    baseUrl: './',
    paths: {
        jquery: 'vendor/jquery'
    },
    name: 'vendor/almond',
    optimize: 'none',
    include: ['src/js/index'],
     insertRequire: ['src/js/index'],
    out: './dist/js-lib.tmpl'
})
