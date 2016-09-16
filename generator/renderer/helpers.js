var _ = require('lodash');

var Helpers = {
  renderCheck: function(data){
    var code = '';
    var trueCheck = function(ch){ return ch + ' is defined and ' + ch; };
    _.each(data, function(dataCode,dataIndex) {
      var checks = (dataCode.match(/\./g) || []).length ? dataCode.split('.') : [dataCode];
      _.each(checks, function(check,i){
        if (0 < i) {
          code += ' and ' + trueCheck( checks[i - 1] + '.' + check );
        } else {
          code += (code !== '' ? ' and ' : '') + trueCheck( check );
        }
      });
    });
    return '{% if ('+code+') %}';
  }
};

module['exports'] = Helpers;