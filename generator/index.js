var fs = require("fs");
var renderer = require(__dirname + "/renderer.js");
var extName = "tvsite_cartridge_idstring";
var genName = "cartridge";
var targetPath = "templates/"+genName;
var componentsPath = __dirname + "/components/";
var isDefined = function(val){ return "undefined" !== typeof val };
var isObject = function(val){ return "object" !== typeof val };
var getBefore = function(tag, id, classses){
	var ret = "<"+tag+" id=\""+id+"\"";
  	ret += " class=\""+(classses || "")+"\">";
	return ret;
};
var getAfter = function(tag){ return "</"+tag+">"; };

var Generator = {
  generate: function(reqName, options){
  	var backlog = { };
 	var childs = isDefined( options ) && isDefined( options.childs ) ? options.childs : {};
    for (var prop in childs) {
		backlog[ prop ] = childs[ prop ];
	}
    backlog[ reqName || '' ] = options || {};

    var generated = "";
    delete backlog._keys;
    for ( var name in backlog ) {
		
    	name = (name || "").trim();
    	var opts = backlog[name];
	    
	    var wrap = false;
	    if ( isDefined(opts.wrap) && opts.wrap ) {
	    	wrap = true;
	    }

	    if (wrap) {
	    	var classes = "";
	    	if ( isDefined(opts.className) ) {
	    		classes += opts.className;
	    	}

	    	var tag = "div";
	    	if ( isDefined(opts.tagType) ) {
	    		tag = opts.tagType;
	    	}

	    	generated += getBefore( tag, genName+"-"+name, classes );
	    }
	    
	    // Set the component
	    var component = null;
	    if ( isDefined( opts.component ) ) {
	      component = opts.component;
	    }

	    var content = "";
	    if ( component ) {
	      content = renderer.renderComponent( component, function(){
	      	var entity;
			if ( isDefined( opts.entity ) ) {
				entity = opts.entity;
			}
			return entity;
	      }( ), opts );
	    } else {
	      content = ( opts.content || "" );
	    }
		
		generated += content;
		if (wrap) {
			//generated += getAfter( "div" );
		}
	    
	    var extensionName = '';
	    if ( '' !== name && '' !== generated ) {
	      fs.writeFile( ('templates/'+genName+'/'+name+'.tmpl') || '', generated, function( err ) {
	        if ( err ) {
	          console.error(err);
	        }
	      });
	      extensionName = '{{ '+extName+'("'+name+'") }}';
	    }

	}

    return extensionName;
  }
};

module['exports'] = Generator;