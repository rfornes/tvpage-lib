$(function(){

  $('div.video-play').on('click', function(){
    tvpage.publish('video:play',$(this).data('video-id'));
  });

  var player = new tvpage.player('#player-holder',{
    playList: TVSite.playList
  });
  
  tvpage.subscribe('video:play', player.play);

  $('#related-products').find('ul').slick({
  	infinite: true,
  	slidesToShow: 3,
  	slidesToScroll: 3
  });

  $('#video-slider-cartridge').find('.slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4
  });

  $('#channel-slider-cartridge').find('.slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4
  });

});