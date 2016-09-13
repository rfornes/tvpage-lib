define(function(require){
  
	var $ = require('jquery');
  
  var reply = null;
  var page = null;
  var activeQuery = null;
  var setts = {
    minChars: 3,
    emptyClear:true,
    outClear: true
  };
  var ajaxParams = null;
  var ajaxSetts = {
    wrap:0,
    form:0,
    includeJS:0,
    includeData:true,
    s: '',
    p: 0,
    n: 1000
  };

	function search(selector,settings,more){
    if (!$ || !$.ajax || !$.debounce || !$.isFunction(more)) return false;

    ajaxParams = $.extend(ajaxSetts, settings.request);
    delete settings.request;
    setts = $.extend(setts, settings);
    
    if (window.TVSite && TVSite.lid) {
      ajaxParams['X-login-id'] = TVSite.lid;
    }

    $el = $(selector);

    var delay = 165;
    $el.find('input')
    .on('keyup',$.debounce(delay,function(e){
      
      var query = $(this).val().trim();
      if ( '' === query || activeQuery === query || query.length >= setts.minChars || !loginId) return;

      ajaxParams.s = query;
      return $.ajax({
        url: ajaxParams.endpoint || '',
        type: 'get',
        dataType: 'json',
        data: ajaxParams
      }).done(function(res){
        var err = Boolean(!res || !res.html || !res.cartridgeData);
        cback(err, !err && res.cartridgeData.searchResults, !err && res.html.trim());
      });


    }))
    .on('focusout',$.debounce(delay,function(e){
      console.log('leaving')
    }));
  }

  return search;

});