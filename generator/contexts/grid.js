var renderer = require(__dirname + '/../renderer');

module.exports = function(entityType,options){

  var context = {};
  
  context.collCode = '';
  if (entityType === 'video') {
    context.collCode = 'channel.videos';
  } 
  else if (entityType === 'products') {
    context.collCode = 'products';
  }
  else {
    context.collCode = 'LIST';
  }

  context.item = '';
  if (options && options.item && '' !== options.item) {
    context.item = renderer.renderItemTemplate(options.item, entityType);
  }

  context.itemClass = '';
  if ( 'undefined' !== options.itemClass && options.itemClass) {
    context.itemClass = options.itemClass;
  }

  context.header = '';
  if (options && options.header && '' !== options.header) {
    context.header += options.header;
  }

  return context;
};