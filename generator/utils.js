var _ = require("lodash");

var Utils = {
  isDefined: function(obj){return "undefined" !== typeof obj},
  renderChecks: function( values ){
    var getChecks = function(object){
      return ( (object.match(/\./g) || []).length ? object.split('.') : [object] );
    };
    var addCheck = function(obj){ return obj + " is defined and " + obj; };
    
    var code = "";
    if ( _.isObject(values) ) {
      _.each( values, function( val ){ 
        var checks = getChecks( val );
        _.each( checks, function( check, index ){
          if ( 0 < index ) {
            code += " and " + addCheck( checks[ index - 1 ] +"."+ check );
          } else {
            code = addCheck( check );
          }
        } );
      } );
    } else {
    	var checks = getChecks( values );
        _.each( checks, function( check, index ){
          if ( 0 < index ) {
            code += " and " + addCheck( checks[ index - 1 ] +"."+ check );
          } else {
            code = addCheck( check );
          }
        } );
    }

    return '{% if ('+code+') %}';
  }
};

module['exports'] = Utils;