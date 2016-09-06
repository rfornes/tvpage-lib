var _ = require('lodash');
var fs = require('fs');

var isSet = function(opt){return ( !_.isUndefined(opt) && opt )};
var entityType = null;

var renderPartial = function(partial,obj){
  if (!isSet( partial )) return console.log('nope');

  var isBS = 'bootstrap' === partial;
  if (isBS) {
    obj.bsChecks = [];
    obj.bs = {};
    
    if (obj.playlist) {
      obj.bsChecks.push('channel and channel.videos');
      obj.bs = {
        playList:'{{channel.videos|json_encode()}}'
      };
    }

  }
  
  var pTml = '';
  if ( !isBS ) {
    pTml += '<div class="'+partial+'">';
  }
  pTml += fs.readFileSync('templates/views/partials/'+partial+'.tmpl').toString();
  if ( !isBS ) {
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
      tmpl += '<p>{{item.title|slice(0, 40)}}</p>';
    } else {
      tmpl += renderPartial(pieces[i]);
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
  return ( ent === 'video' ? 'channel.videos' : ('product' === ent ? 'products' : '') )
};

var Generator = {
  generate: function(name, opts){

    if (entityType) entityType = null;
    entityType = opts.entity || '';
    
    name = name || '';
    name = name.trim();

    var component = opts.component;

    var widget = '<section class="'+name+'">';
    if ('slider' === component) {

    } else if ('player' === component) {

      widget += '<div id="player-holder"></div>';

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

    } else {

    }

    widget += '</section>';

    if (name !== '') {
      writeFile(name, widget);
    }

    return '{{ tvsite_cartridge_idstring("'+name+'") }}';
  }
};

module['exports'] = Generator;