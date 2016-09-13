var _ = require('lodash');
var fs = require('fs');
var beautify = require('js-beautify').html;

var isSet = function(opt){return ( !_.isUndefined(opt) && opt )};
var entityType = null;

var partialHelpers = {
  renderCheck: function(data){
    var code = '';
    var trueCheck = function(ch){ return ch + ' is defined and ' + ch; };
    _.each(data, function(dataCode,dataIndex) {
      var checks = (dataCode.match(/\./g) || []).length ? dataCode.split('.') : [dataCode];
      _.each(checks, function(check,i){
        if (0 < i) {
          code += ' and ' + trueCheck( checks[i - 1] + '.' + check );
        } else {
          code += (code !== '' ? ' and ' : '') + trueCheck( check );
        }
      });
    });
    return '{% if ('+code+') %}';
  }
};
var renderPartial = function(partial,obj){
  if (!isSet( partial )) return console.log('nope');

  var noWrap = obj && false === obj.wrap ? 1 : 0;
  var pTml = '';

  if ( !noWrap && partial !== 'bootstrap') {
    pTml += '<div class="'+partial+' container">';
  }
  pTml += fs.readFileSync('src/views/partials/'+partial+'.tmpl').toString();
  if ( !noWrap && partial !== 'bootstrap') {
    pTml += '</div/>';
  }

  var html = ( _.template( pTml )( _.extend(obj, partialHelpers) ) ).trim();
  return html;
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

// Generates the cartridge content, with checks, settings ready, etc.
var Generator = {
  generate: function(name, opts, isWidget){

    if (entityType) entityType = null;
    entityType = opts && opts.entity ? opts.entity : '';

    var component = opts && opts.component ? opts.component : '';
    
    name = name || '';
    name = name.trim();
    var isConfig = 'config' === name;
    
    var generated = '';
    if ('config' === name) {
      generated += renderPartial('bootstrap',{
        data: {
          lid: 'loginId',
          domain: 'domain'
        },
        asString: true
      });
    }

    if (!isConfig) {
      generated += '<section id="'+name+'-cartridge">';
    }

    if ('breadcrumb' === name) {
      generated += renderPartial('breadcrumb',{
        separator: opts && opts.separator ? opts.separator.trim() : ''
      });
    }

    if ('player' === name) {
      generated += renderPartial('div', {
        wrap: false,
        id: 'player-holder',
        className: 'player-holder'
      });
    }

    if ('video-grid' === name || 'channel-grid' === name) {
      generated += renderPartial('grid', function(){
        var data = {};
        
        data.items = '';
        if ('undefined' !== typeof entityType) {
          data.items = getItems( entityType );
        }

        data.item = '';
        if (opts && opts.item && '' !== opts.item) {
          data.item = renderItemTemplate(opts.item);
        }

        data.itemClass = '';
        if ( isSet(opts.itemClass) ) {
          data.itemClass = opts.itemClass;
        }

        data.header = '';
        if (opts && opts.header && '' !== opts.header) {
          data.header += opts.header;
        }

        return data;
      }());
    }

    // if ('list' === component) {
    //   generated += renderPartial('list',{
    //     items: getItems( entityType ),
    //     itemTemplate: renderItemTemplate(opts.itemTemplate)
    //   });
    // } 

    if ('video-slider' === name || 'channel-slider' === name) {
      generated += renderPartial('slick-slider-base', function(){
        var data = {};
        
        data.items = '';
        if ('undefined' !== typeof entityType) {
          data.items = getItems( entityType );
        }

        data.itemClass = '';
        if ( isSet(opts.itemClass) ) {
          data.itemClass = opts.itemClass;
        }

        data.rows = null;
        if ('channel' === entityType) {
          data.rows = false;
        }

        data.item = '';
        if (opts && opts.item && '' !== opts.item) {
          data.item = renderItemTemplate(opts.item);
        }

        data.header = '';
        if (opts && opts.header && '' !== opts.header) {
          data.header += opts.header;
        }

        return data;
      }());

      if ( isSet( opts.renderData ) ) {
        generated += renderPartial('bootstrap',{
          data: {
            playList: 'channel.videos'
          }
        });
      }
    }

    if (!isConfig) {
      generated += '</section>';
    }

    if (name !== '') {
      writeFile(name, generated);
    }

    var ret = '';
    if (isWidget) {
      ret = renderPartial('widget-code',{
        wrap: false
      });
    } else {
      ret = '{{ tvsite_cartridge_idstring("'+name+'") }}';
    }

    return ret;
  }
};

module['exports'] = Generator;