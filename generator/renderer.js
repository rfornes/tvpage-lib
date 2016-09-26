var _ = require('lodash');
var fs = require('fs')
var getPath = function(comp,item){
  if ('undefined' === comp) return console.log('nope');
  return __dirname + "/components/" + comp + "/" + item + ( "template" === item ? ".tmpl" : ".js" );
};
var renderDiv = function(id,className,content){
  return '<div id="'+id+'" class="'+className+'">'+( content || '' )+'</div>';
};

// Renders the output of file system templates + settings + helpers
// and an optional wrapper to meet grid system layout.
var renderComponent = function(component, entity, options){
  if ( "undefined" === component ) return console.log('nope');

  var template = "";
  try {
  	template += fs.readFileSync( getPath( component, "template" ) ).toString(); 
  } catch (e) {
   	console.log('no template found for '+component);
  }

  var helpers = {};
  try {
    helpers = require( getPath( component, "helpers" ) );
  } catch (e) {
    console.log('no helpers found for '+component);
  }

  return ( _.template(template)( _.extend({ entity: entity, options: options }, helpers) ) );
};

var Renderer = {
  renderDiv: renderDiv,
  renderComponent: renderComponent,
  // renderItemTemplate: function(required, entityType){
  //   var pieces = ['thumbnail', 'title', 'metadata'];
  //   var diff = _.difference(pieces, required);
  //   for (var i = 0; i < diff.length; i++) {
  //     pieces = _.without(pieces, diff[i]);
  //   }

  //   var tmpl = '';
  //   for (var i = 0; i < pieces.length; i++) {
  //     if ('title' === pieces[i]) {
        
  //       var title = 'item.title';
  //       if ('channel' === entityType) {
  //         title = 'item.channelId.title';
  //       }

  //       tmpl += '<p>{{'+title+'|slice(0, DATA.titleLength is defined ? DATA.titleLength : 40)}}</p>';
  //     } else {
  //       tmpl += render(pieces[i],{
  //         wrap: false,
  //         entity: entityType
  //       });
  //     }
  //   }

  //   return tmpl;
  // }
};

module['exports'] = Renderer;