$(function(){

  $('div.video-play').on('click', function(){
    tvpage.publish('video:play',$(this).data('video-id'));
  });

  var player = new tvpage.player('#player-holder',{ 
    playList: TVSite.playList
  });
  
  tvpage.subscribe('video:play', player.play);

});