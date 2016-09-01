define(function(require){
  
  var events = require('src/events');

  require('src/plugins');

  return {
  	VERSION: '0.0.0',
  	player: require('src/player'),
  	subscribe: events.subscribe,
  	unsubscribe: events.unsubscribe,
  	publish: events.publish,
  	load: require('src/load'),
    search: require('src/search')
  };
  
});