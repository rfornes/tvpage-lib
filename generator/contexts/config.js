module.exports = function(entityType,opts){
  return {
    asString: true,
    wrap: false,
    data: {
      lid: "loginId",
      domain: "domain"
    }
  };
};