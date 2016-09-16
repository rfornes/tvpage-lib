var _ = require('lodash');
var fs = require('fs');
var renderer = require(__dirname + '/renderer');
var genName = 'cartridge';
var extName = 'tvsite_cartridge_idstring';

var Generator = {
  generate: function(name, opts){

    var entityType = null;
    if ('undefined' !== typeof opts && opts.entity) {
      entityType =  opts.entity;
    }
    
    name = name || '';
    name = name.trim();
    
    var generated = '';
    if ('config' === name) {
      generated += renderer.renderPartial('bootstrap',{
        asString: true,
        wrap: false,
        data: {
          lid: 'loginId',
          domain: 'domain'
        }
      });
    }

    var isConfig = 'config' === name;
    if (!isConfig) {
      generated += '<section id="'+name+'-'+genName+'">';
    }

    if ('breadcrumb' === name) {
      generated += renderer.renderPartial('breadcrumb',{
        separator: opts && opts.separator ? opts.separator.trim() : ''
      });
    }

    if ('player' === name) {
      generated += renderer.div(name,name);;
    }

    if ('video-grid' === name || 'channel-grid' === name) {
      var gridContext = require(__dirname + '/contexts/grid.js')(entityType,opts);
      generated += renderer.renderPartial('grid', gridContext);
    }

    if ('video-slider' === name || 'channel-slider' === name) {
      
      var sliderContext = require(__dirname + '/contexts/slider.js')(entityType,opts);
      generated += renderer.renderPartial('slider', sliderContext);

      if ( 'undefined' !== opts.renderData && opts.renderData ) {
        generated += renderer.renderPartial('bootstrap',{
          data: {
            playList: 'channel.videos'
          }
        });
      }
    }

    if (!isConfig) {
      generated += '</section>';
    }

    if (name !== '' && generated !== '') {
      fs.writeFile(('templates/'+genName+'/'+name+'.tmpl') || '', generated, function(err){
        if (err) {
          console.error(err);
        }
      });
    }

    return '{{ '+extName+'("'+name+'") }}';
  }
};

module['exports'] = Generator;