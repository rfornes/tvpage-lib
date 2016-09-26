var renderer = require(__dirname + '/../renderer');

module.exports = function(entityType,options){

  var context = {};

  context.itemClass = '';
  if ( 'undefined' !== options.itemClass && options.itemClass) {
    context.itemClass = options.itemClass;
  }

  context.rows = null;
  if ('channel' === entityType) {
    context.rows = false;
  }

  context.header = '';
  if (options && options.header && '' !== options.header) {
    context.header += options.header;
  }

  // Collection code
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

  // Item Interpolation
  context.item = '';
  if (options && options.item && '' !== options.item) {
    context.item = renderer.renderItemTemplate(options.item,entityType);
  }

  return context;
  
};