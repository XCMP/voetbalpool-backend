(function (Game, Prediction, calculateScores) {

  var getGames = function (req, res, filter) {
    var response;
    Game.find(filter)
      .populate('homeTeam awayTeam')
      .sort({ matchDay: 1})
      .exec(function (err, games) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {'error' : true,'message' : 'Error fetching data'};
        } else {
            response = games;
        }
        res.json(response);
      });
    };

  // get /vp/games/:yyyy/:mm
  exports.listByMonth = function (req, res) {
    var year = req.params.yyyy;
    var monthIndex = parseInt(req.params.mm, 10) - 1;
    var from = new Date(year, monthIndex, 1).getTime();
    var to = new Date(year, monthIndex+1, 1).getTime();
    var filter = {
      'matchDay': {
        $gte: new Date(from),
        $lt: new Date(to)
      }
    };
    return getGames(req, res, filter);
  };

  // get /vp/games
  exports.list = function (req, res) {
    var filter = {
      'matchDay': {
        $gte: Date.now()
      }
    };
    return getGames(req, res, filter);
  };

  // post /vp/game
  exports.create = function (req, res) {
    var game = new Game();
    game.matchDay = req.body.matchDay;
    game.homeTeam =  req.body.homeTeam;
    game.awayTeam =  req.body.awayTeam;
    game.homeTeamGoals =  req.body.homeTeamGoals;
    game.awayTeamGoals =  req.body.awayTeamGoals;
    game.notes = req.body.notes;
    game.save(function (err) {
      if (err) {
        res.json({ 
          status  : 400,
          error   : true,
          response: err, 
          message : 'Game validation error.'
        });
      } else {
        res.json({
          status  : 201,
          error   : false,
          response: game,
          message : 'Game created.'
        });
      }
    });
  };

  // get /vp/game/:id
  exports.get = function (req, res) {
    Game.findById(req.params.id)
      .populate('homeTeam awayTeam')
      .exec(function (err, game) {
      if (err) {
        res.json({
          status  : 404,
          error   : true,
          response: err,
          message : 'Error getting game with id ' + req.params.id
        });
      } else {
        res.json(game);
      }
    });
  };

  // put /vp/game/:id
  exports.update = function (req, res) {
    return Game.findById(req.params.id, function (err, game) {
      game.matchDay = req.body.matchDay;
      game.homeTeam =  req.body.homeTeam;
      game.awayTeam =  req.body.awayTeam;
      game.homeTeamGoals =  req.body.homeTeamGoals;
      game.awayTeamGoals =  req.body.awayTeamGoals;
      game.notes = req.body.notes;
      return game.save(function (err) {
        if (err) {
          res.json({ 
            status  : 400,
            error   : true,
            response: err, 
            message : 'Game validation error.'
          });
        } else {
          res.json({
            status  : 200,
            error   : false,
            response: game,
            message : 'Game saved.'
          });
          calculateScores(game._id);
        }
      });
    });
  };

  // delete /vp/game.:id
  exports.delete = function (req, res) {
    var response;
    // find the data
    Game.findById(req.params.id, function (err, game) {
      if (err) {
        response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        // data exists, remove it.
        // first remove predictions for this game
        Prediction.remove({game : req.params.id}).exec();
        Game.remove({_id : req.params.id},function (err) {
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

})(require('../mongo/models/game'), require('../mongo/models/prediction'), require('../services/calculateScores'));