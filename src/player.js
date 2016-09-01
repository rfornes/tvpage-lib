define(function(require){

	var $ = require('jquery');

	var setts = {
		controls:{
			floater:{removeControls:['tvplogo']}
		}
	};
	var $el = null;
	var	playerInstance = null;
	var	isLoaded = false;
	var playList = null;
	var toPlay = null;

	var play = function(obj,cue){ 
		if (!obj || !playerInstance) return false;
		var asset = !obj.asset && obj.type && obj.sources ? obj : obj.asset;
		asset.sources = asset.sources || [{file:asset.videoId}];
		asset.type = asset.type || 'youtube';
		asset.analyticsObj = {vd:asset.id,li:obj.loginId,pg:obj.parentId};
		var action = cue ? 'cue' : 'load';
		playerInstance[ action + 'Video' ](asset);
	};

	var player = function(selector,settings,list){
		
		$el = $(selector);
		if (!$el.length) return false;

		playList = list;
		setts.divId = selector.replace('#','');
		setts = $.extend(settings, setts);
		
		var isLibReady = function(){return ( window.TVPage && TVPage.player )};
		(function(run, create){
			if (isLibReady()) {
				run( create() );
			} else {
				$.ajax({
					url: 'http://d2kmhr1caomykv.cloudfront.net/player/assets/tvp/tvp-1.7.24-min.js',
					dataType: 'script',
					cache: true
				}).done(function(){ 
					if (isLibReady()) {
						run( create() );
					}
				});
			}
		}(function(instance){
			setts.onReady = function(){
				if (isLoaded || !playList.length || !playerInstance ) return;
				playerInstance.resize($el.width(),$el.height());
				play( playList[0], !Boolean(setts.autoplay) );
			    isLoaded = true;
			};
			playerInstance = TVPage.instances[instance.options.globalRunId];
		},function(){ return ( isLibReady ? new TVPage.player(setts) : {} ); }));
	};

	player.prototype = {
		play: function(){
			if (!arguments || !playList.length) return false;
			
			toPlay = arguments[ 2 === arguments.length ? 1 : 0 ];
			
			if ('object' === typeof toPlay) {
				return play(toPlay);
			} else if ( !isNaN(+toPlay) ) {
				var found;
				for (var i = 0; i < playList.length; i++) {
					var video = playList[i];
					if (+video.id === toPlay) {
						found = video;
					}
				}
				if (found) {
					play(found);
				} else {
					console.log('id not found');
				}
			}
		}
	};

	return player;

});