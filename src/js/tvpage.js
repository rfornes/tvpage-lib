define(function(require){
  
  var events = require('src/js/events');

  require('src/js/plugins');

  return {
  	VERSION: '0.0.0',
  	player: require('src/js/player'),
  	subscribe: events.subscribe,
  	unsubscribe: events.unsubscribe,
  	publish: events.publish,
  	load: require('src/js/load'),
    search: require('src/js/search')
  };
  
});