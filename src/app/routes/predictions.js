(function (Prediction, Game, Poolplayer, Club) {

  // get /vp/predictions/:yyyy/:mm
  exports.listByMonth = function (req, res) {
    var year = req.params.yyyy;
    var monthIndex = parseInt(req.params.mm, 10) - 1;
    var from = new Date(year, monthIndex, 1).getTime();
    var to = new Date(year, monthIndex+1, 1).getTime();
    var response;
    // fetch games in period
    Game.find({
      'matchDay': {
        $gte: new Date(from),
        $lt: new Date(to)
      }
    })
    .select({ _id: 1})
    .exec(function (err, gameIds) {
      if (err) {
          response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        // fetch predictions for found games
        Prediction.find({
          'game': {$in: gameIds}
        })
        .populate('poolplayer')
        .populate({
          path: 'game',
          populate: {path:'homeTeam awayTeam', model:'Club'}
        })
        .exec(function (err, predictions) {
          if (err) {
              response = {'error' : true,'message' : 'Error fetching data'};
          } else {
            response = predictions;
          }
          res.json(response);
        });
      }
    });
  };

  // post /vp/prediction
  exports.create = function (req, res) {
    var prediction = new Prediction();
    prediction.poolplayer = req.body.poolplayer;
    prediction.game = req.body.game;
    prediction.homeTeamGoals = req.body.homeTeamGoals;
    prediction.awayTeamGoals = req.body.awayTeamGoals;
    prediction.save(function (err) {
      if (err) {
        res.json({ 
          status  : 400,
          error   : true,
          response: err, 
          message : 'Prediction validation error.'
        });
      } else {
        res.json({
          status  : 201,
          error   : false,
          response: prediction,
          message : 'Prediction created.'
        });
      }
    });
  };

  // get /vp/prediction/:id
  exports.get = function (req, res) {
    Prediction.findById(req.params.id)
      .exec(function (err, prediction) {
      if (err) {
        res.json({
          status  : 404,
          error   : true,
          response: err,
          message : 'Error getting club with id ' + req.params.id
        });
      } else {
        res.json(prediction);
      }
    });
  };

  // put /vp/prediction/:id
  exports.update = function (req, res) {
    return Prediction.findById(req.params.id, function (err, prediction) {
      prediction.poolplayer = req.body.poolplayer;
      prediction.game = req.body.game;
      prediction.homeTeamGoals = req.body.homeTeamGoals;
      prediction.awayTeamGoals = req.body.awayTeamGoals;
      return prediction.save(function (err) {
        if (err) {
          res.json({ 
            status  : 400,
            error   : true,
            response: err, 
            message : 'Prediction validation error.'
          });
        } else {
          res.json({
            status  : 200,
            error   : false,
            response: prediction,
            message : 'Prediction saved.'
          });
        }
      });
    });
  };

  // delete /vp/prediction/:id
  exports.delete = function (req, res) {
    var response;
    // find the data
    Prediction.findById(req.params.id, function (err, prediction) {
      if (err) {
        response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        // data exists, remove it.
        Prediction.remove({_id : req.params.id},function (err) {
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

})(
  require('../mongo/models/prediction'),
  require('../mongo/models/game'),
  require('../mongo/models/poolplayer'),
  require('../mongo/models/club')
);