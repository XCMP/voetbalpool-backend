(function (Poolplayer, Prediction) {

  // get /vp/poolplayers
  exports.list = function (req, res) {
    var response;
    Poolplayer.find({}, function (err, poolplayers) {
      // Mongo command to fetch all data from collection.
      if (err) {
        response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        response = poolplayers;
      }
      res.json(response);
    });
  };

  // post /vp/poolplayer
  exports.create = function (req, res) {
    var poolplayer = new Poolplayer();
    poolplayer.name = req.body.name;
    poolplayer.birthday =  req.body.birthday;
    poolplayer.color = req.body.color;
    poolplayer.notes = req.body.notes;
    poolplayer.save(function (err) {
      if (err) {
        res.json({ 
          status  : 400,
          error   : true,
          response: err, 
          message : 'Poolpayer validation error.'
        });
      } else {
        res.json({
          status  : 201,
          error   : false,
          response: poolplayer,
          message : 'Poolpayer created.'
        });
      }
    });
  };

  // get /vp/poolplayer/:id
  exports.get = function (req, res) {
    Poolplayer.findById(req.params.id, function (err, poolplayer) {
      if (err) {
        res.json({
          status  : 404,
          error   : true,
          response: err,
          message : 'Error getting poolpayer with id ' + req.params.id
        });
      } else {
        res.json(poolplayer);
      }
    });
  };

  // get /vp/auth/:id/:password
  exports.auth = function (req, res) {
    console.log('auth backend');
    Poolplayer.findById(req.params.id, function (err, poolplayer) {
      if ((poolplayer.get('password') !== req.params.password) || err) {
        res.json({
          status  : 401,
          error   : true,
          response: err,
          message : 'Error not authorized'
        });
      } else {
        res.json(poolplayer);
      }
    });
  };

  // put /vp/poolplayer/:id
  exports.update = function (req, res) {
    return Poolplayer.findById(req.params.id, function (err, poolplayer) {
      poolplayer.name = req.body.name;
      poolplayer.birthday =  req.body.birthday;
      poolplayer.color = req.body.color;
      poolplayer.notes = req.body.notes;
      return poolplayer.save(function (err) {
        if (err) {
          res.json({ 
            status  : 400,
            error   : true,
            response: err, 
            message : 'Poolpayer validation error.'
          });
        } else {
          res.json({
            status  : 200,
            error   : false,
            response: poolplayer,
            message : 'Poolpayer saved.'
          });
        }
      });
    });
  };

  // delete /vp/poolplayer/:id
  exports.delete = function (req, res) {
    var response;
    // find the data
    Poolplayer.findById(req.params.id, function (err, poolplayer) {
      if (err) {
        response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        // data exists, remove it.
        // first remove predictions of this player
        Prediction.remove({poolplayer : req.params.id}).exec();
        Poolplayer.remove({_id : req.params.id},function (err) {
          if (err) {
            response = {'error' : true, 'message' : 'Error deleting data'};
          } else {
            response = {'error' : false, 'message' : 'Data associated with ' + req.params.id + ' is deleted'};
          }
          res.json(response);
        });
      }
    });
  };

})(require('../mongo/models/poolplayer'), require('../mongo/models/prediction'));