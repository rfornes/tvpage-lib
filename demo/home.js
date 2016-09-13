$(function(){

  var player = new tvpage.player('#player-holder',{
    playList: TVSite.playList
  });

  tvpage.subscribe('video:play', player.play);

  $('div.tvp-action-play').on('click', function(e){
    if(e) e.preventDefault();
    tvpage.publish('video:play',$(this).attr('id').split('-').pop());
  });

  var sliderSettings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerMode: true,
          centerPadding: '60px'
        }
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
          centerMode: true,
          centerPadding: '60px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '60px',
        }
      }
    ]    
  };

  $('#video-slider-cartridge').find('.slider').slick(sliderSettings);
  $('#channel-slider-cartridge').find('.slider').slick(sliderSettings);

});