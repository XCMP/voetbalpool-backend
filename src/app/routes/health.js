(function() {

  // health check needed for OpenShift
  exports.health = function (req, res) {
    res.writeHead(200);
    res.end();
  };

})();