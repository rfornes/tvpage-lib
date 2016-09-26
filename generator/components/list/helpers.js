var u = require(__dirname + "/../../utils.js");

var Helpers = {
  render: function( entity, options){

    // Dinamically set the twig code for the template.
    var listCode = "";
    var listItem = "";
    var setCode = function(list,item){
      listCode = list;
      listItem = item;
    };
    if (entity === "video") {
      setCode( "channel.videos", "video" );
    } else if (entity === "products") {
      setCode( "products", "product" );
    } else if (entity === "channel") {
      setCode( "LIST", "<a href=\"{{ tvsite_canonical_url(item.channelId, null, null) }}\">{{item.channelId.titleTextEncoded}}</a>" );
    } else if (entity === "link") {
      setCode( "LIST", "<a href=\"{{item.link}}\">{{item.linkTitle}}</a>" );
    }

    var classes = "";
    if ( u.isDefined(options) && u.isDefined(options.classes) ) {
      classes += options.classes;
    }
    if ( u.isDefined(options) && u.isDefined(options.orientation) && "horizontal" === options.orientation ) {
      classes += "list-inline";
    }

    // Dinamically set the list item
  	var html = u.renderChecks(listCode).trim()+"\n";
  	html += "  <ul class=\""+classes+"\">\n";
    html += "    {% for item in "+listCode+" %}";
    html += u.renderChecks( entity === "channel" ? "item.channelId" : "item" ).trim();

	if ( entity !== "channel" ) {
		html += "	{% if (item == \"DROPDOWN\") %}";
		html += " 		<li class=\"dropdown\">";
		html += '			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown<span class="caret"></span></a>\n';
		html += " 			{{ tvsite_cartridge_idstring( item.linkTitle ) }}";
		html += " 		</li>\n";
		html += "	{% else %}";
		html += "		<li>"+listItem+"</li>\n";	
		html += "	{% endif %}";
	}
    
    html += "      {% endif %}";
    html += "    {% endfor %}";
    html += "  </ul>\n";
    html += "{% endif %}";
    return html;
  }
};

module['exports'] = Helpers;