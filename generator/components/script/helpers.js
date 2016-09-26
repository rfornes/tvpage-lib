var _ = require("lodash");
var u = require(__dirname + "/../../utils.js");

var Helpers = {
  render: function( options ){
    var data = {};
    if ( u.isDefined( options ) && u.isDefined( options.config ) ) {
    	data = {
    		lid: "loginId",
      		domain: "domain"
    	};
    }

    var glob = 'Config';
    if ( u.isDefined(options) && u.isDefined(options.globalName) ) {
    	glob = options.globalName;
    }

    var script = u.renderChecks(data).trim() + "<!-- bootstrap data --><script>/* beautify ignore:start */\n";
    script += glob+" = window."+glob+" || {};\n";

    var asString = [ "domain" ];
    _.each(data, function(val, key){
      var item = "{{"+val+"}}";
      if ( -1 !== asString.indexOf(key) ) {
      	item = "\"" + item + "\"";
      }
      script += "TVSite[\""+key+"\"] = "+item+";\n";
    });
    
    script += "/* beautify ignore:end */</script>\n";
    return script += "{% endif %}\n";
  }
};

module["exports"] = Helpers;