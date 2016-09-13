define(function(require){
  
  	var $ = require('jquery');

  	function load(endpoint,opts,cback){
      
      if (!$ || !$.ajax || !$.isFunction(cback)) return false;
      
      $.ajax({
    		url: endpoint,
    		type: 'post',
    		dataType: 'json',
    		data: JSON.stringify({
    			'X-login-id': TVSite.lid,
    			videoId: opts.id || 0,
    			includeData: 'undefined' !== opts.data ? opts.data : false,
    			includeJS:0,
          includeMeta:0,
    			wrap:0
    		})
    	}).done(function(res){
    		
        if (!res || !res.html || !res.html.trim()) {
          cback(true,res);
        } else {
          cback(null,res.html.trim());
        }
        
    	});
    }

    return load;

});