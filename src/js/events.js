define(function(require){
  
  	var $ = require('jquery');

	var events = {};
	var $disp = $({});

	events.subscribe = function(){
		$disp.on.apply($disp, arguments);
	};

	events.unsubscribe = function(){
		$disp.off.apply($disp, arguments);
	};

	events.publish = function(){
		$disp.trigger.apply($disp, arguments);
	};

  	return events;
});