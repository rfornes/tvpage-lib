var _ = require('lodash');
var fs = require('fs');

var isSet = function(opt){return ( !_.isUndefined(opt) && opt )};
var entityType = null;

var renderPartial = function(partial,obj){
  if (!isSet( partial )) return console.log('nope');

  if ('bootstrap' === partial) {
    obj.bsChecks = [];
    obj.bs = {};
    
    if (obj.playlist) {
      obj.bsChecks.push('channel and channel.videos');
      obj.bs = {
        playList:'{{channel.videos|json_encode()}}'
      };
    }

    if (obj.config) {
      obj.asString = true;
      obj.bsChecks.push('loginId and domain');
      obj.bs = {
        loginId:'{{loginId}}',
        domain:'{{domain}}'
      };
    }

  }

  var noWrap = obj && false === obj.wrap ? 1 : 0;
  var pTml = '';
  
  if ( !noWrap ) {
    pTml += '<div class="'+partial+' container">';
  }
  
  pTml += fs.readFileSync('src/views/partials/'+partial+'.tmpl').toString();
  
  if ( !noWrap ) {
    pTml += '</div/>';
  }

  return _.template( pTml )( obj );
};

var renderItemTemplate = function(required){
  var pieces = ['thumbnail', 'title', 'metadata'];
  var diff = _.difference(pieces, required);
  
  for (var i = 0; i < diff.length; i++) {
    pieces = _.without(pieces, diff[i]);
  }

  var tmpl = '';
  for (var i = 0; i < pieces.length; i++) {
    if ('title' === pieces[i]) {
      
      var title = 'item.title';
      if ('channel' === entityType) {
        title = 'item.channelId.title';
      }

      tmpl += '<p>{{'+title+'|slice(0, DATA.titleLength is defined ? DATA.titleLength : 40)}}</p>';
    } else {
      tmpl += renderPartial(pieces[i],{
        wrap: false,
        entity: entityType
      });
    }
  }

  return tmpl;
};

var writeFile = function(fileName,text){
  if (!fileName || !text) return console.log('bad args');
  fs.writeFile( ('templates/cartridge/'+fileName+'.tmpl') || '', text || '', function(err){
    if (err) {
      console.error(err);
    }
  });
};

var getItems = function(ent){
  var itemsCode = '';
  if (ent === 'channel') {
    itemsCode = 'LIST';
  }
  if (ent === 'video') {
    itemsCode = 'channel.videos';
  }
  if (ent === 'product') {
    itemsCode = 'products';
  }
  return itemsCode;
};

var Generator = {
  generate: function(name, opts){

    if (entityType) entityType = null;
    entityType = opts && opts.entity ? opts.entity : '';

    var component = opts && opts.component ? opts.component : '';
    
    name = name || '';
    name = name.trim();
    var isConfig = 'config' === name;

    var widget = '';
    if (!isConfig) {
      widget += '<section id="'+name+'-cartridge">';
    }
    
    if ('config' === name) {
      widget += renderPartial('bootstrap',{
        wrap: false,
        config: true
      });
    }

    if ('breadcrumbs' === name) {
      widget += renderPartial('breadcrumbs',{
        separator: opts && opts.separator ? opts.separator.trim() : ''
      });
    }

    if ('player' === component) {

      widget += '<div id="player-holder" class="player-holder"></div>';

    } else if ('gallery' === component) {
      var playback = isSet( opts.playback );
      
      if ( isSet( opts.searchBar ) ) {
        widget += renderPartial('search-bar', 'gallery');
      }
      
      widget += renderPartial('grid',{
        items: getItems( entityType ),
        itemTemplate: renderItemTemplate(opts.itemTemplate),
        itemClass: playback && 'video-play'
      });

      if ( isSet( opts.pagination ) ) {
        widget += renderPartial('pagination', { pages: 5 });
      }

      if ( playback ) {
        widget += renderPartial('bootstrap',{
          playlist: true
        });
      }

    } else if ('list' === component) {

      widget += renderPartial('list',{
        items: getItems( entityType ),
        itemTemplate: renderItemTemplate(opts.itemTemplate)
      });

    } else if ('slider' === component) {
      var playback = isSet( opts.playback );
      
      var data = {
        items: getItems( entityType ),
        itemClass: playback ? 'video-play' : ''
      };

      data.rows = null;
      if ('channel' === entityType) {
        data.rows = false;
      }

      data.itemTemplate = '';
      if (opts && opts.itemTemplate && '' !== opts.itemTemplate) {
        data.itemTemplate = renderItemTemplate(opts.itemTemplate);
      }

      data.header = '';
      if (opts && opts.header && '' !== opts.header) {
        data.header += opts.header;
      }

      widget += renderPartial('slick-slider-base', data);

      if ( playback ) {
        widget += renderPartial('bootstrap',{
          playlist: true
        });
      }

    } else {

    }

    if (!isConfig) {
      widget += '</section>';
    }

    if (name !== '') {
      writeFile(name, widget);
    }

    return '{{ tvsite_cartridge_idstring("'+name+'") }}';
  }
};

module['exports'] = Generator;