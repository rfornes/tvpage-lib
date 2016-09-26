var isDefined = function(val){ return 'undefined' !== typeof val };

module.exports = function(entity,options){

  var context = {};

  context.className = "";
  if (isDefined(options) && isDefined(options.orientation) && "horizontal" === options.orientation) {
    context.className += "list-inline";
  }

  var code = 'LIST';
  if (entity === 'video') {
    code = 'channel.videos';
  } 
  else if (entity === 'products') {
    code = 'products';
  }
  context.listCode = code;

  var listItemType = '';
  if (isDefined(entity)) {
    if('link' === entity) {
      listItemType = 'link';
    } else if ('channel' === entity) {
      listItemType = 'channel';
    }
  }
  context.listItemType = listItemType;

  return context;
};