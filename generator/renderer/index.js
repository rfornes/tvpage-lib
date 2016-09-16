var _ = require('lodash');
var fs = require('fs');
var helpers = require(__dirname + '/helpers.js');

// Renders the output of file system templates + settings + helpers
// and an optional wrapper to meet grid system layout.
var render = function(partial,obj){
  if ('undefined' === partial) return console.log('nope');

  var wrap = function(ob){
    var val = 1;
    if ( 'object' !== typeof ob && !ob ) {
      val = 0;
    } else if ( false === ob.wrap ) {
      val = 0;
    }
    return val;
  }(obj);
  
  var pTml = '';

  if ( wrap ) {
    pTml += '<div class="'+partial+pTml+' container" ';
    if ('undefined' !== obj.id && obj.id) {
      pTml += 'id="'+obj.id+'"'
    }
    pTml += '>';
  }
  
  pTml += fs.readFileSync(__dirname + '/../partials/'+partial+'.tmpl').toString();
  
  if ( wrap ) {
    pTml += '</div/>';
  }

  var html = ( _.template( pTml )( _.extend(obj, helpers) ) ).trim();

  return html;
};

var Renderer = {
  div: function(id,className,content){
    return '<div id="'+id+'" class="'+className+'">'+( content || '' )+'</div>';
  },

  renderPartial: render,
  renderItemTemplate: function(required, entityType){
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
        tmpl += render(pieces[i],{
          wrap: false,
          entity: entityType
        });
      }
    }

    return tmpl;
  }
};

module['exports'] = Renderer;