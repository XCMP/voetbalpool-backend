(function(express, path, bodyparser, 

        db, Poolplayer, Club, Game, Prediction,

        calculateScores

  ) {

  var PORT = 3001;
  var server = express();
  var router = express.Router();

  server.use(bodyparser.json());
  server.use(bodyparser.urlencoded({'extended' : false}));
  server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  router.route('/vp/prediction/months')
    .get(function(req,res) {
      var response;
      Game.aggregate([
        { $project: {
            _id: 0,
            'yyyymm': {$concat: [{$substr: [ '$matchDay', 0, 4 ]}, '-', {$substr: [ '$matchDay', 5, 2 ]}]}
          }
        },
        { $group: {
            '_id': {
                'yyyymm'  : '$yyyymm'
            },
          }
        },
        { $project: {
            '_id': 0,
            'yyyymm': '$_id.yyyymm'
          }
        },
        { $sort: { 'yyyymm': -1 } }
      ])
      .exec(function(err, games) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {'error' : true, 'message' : 'Error fetching data'};
        } else {
            response = games;
        }
        res.json(response);
      });
    });

  router.route('/vp/predictions/:yyyy/:mm')
    .get(function(req,res) {
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
      .exec(function(err, gameIds) {
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
          .exec(function(err, predictions) {
            if (err) {
                response = {'error' : true,'message' : 'Error fetching data'};
            } else {
              response = predictions;
            }
            res.json(response);
          })
        }
      });
    });

  router.route('/vp/prediction')
    .post(function(req,res) {
      var prediction = new Prediction();
      prediction.poolplayer = req.body.poolplayer;
      prediction.game = req.body.game;
      prediction.homeTeamGoals = req.body.homeTeamGoals;
      prediction.awayTeamGoals = req.body.awayTeamGoals;
      prediction.save(function(err) {
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
    });

  router.route('/vp/prediction/:id')
    .get(function (req,res) {
      Prediction.findById(req.params.id)
        .exec(function(err, prediction) {
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
    })
    .put(function (req, res) {
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
      })
    })
    .delete(function (req,res) {
      var response;
      // find the data
      Prediction.findById(req.params.id, function(err, prediction) {
        if (err) {
          response = {'error' : true,'message' : 'Error fetching data'};
        } else {
          // data exists, remove it.
          Prediction.remove({_id : req.params.id},function(err) {
              if (err) {
                  response = {'error' : true, 'message' : 'Error deleting data'};
              } else {
                  response = {'error' : false, 'message' : 'Data associated with ' + req.params.id + ' is deleted'};
              }
              res.json(response);
          });
        }
      });
    });

  router.route('/vp/clubs')
    .get(function(req,res) {
      var response;
      Club.find({},function(err, clubs) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {'error' : true,'message' : 'Error fetching data'};
        } else {
            response = clubs;
        }
        res.json(response);
      });
    });

  router.route('/vp/club')
    .post(function(req,res) {
      var club = new Club();
      club.name = req.body.name;
      club.logoBase64Url =  req.body.logoBase64Url;
      club.save(function(err) {
        if (err) {
          res.json({ 
            status  : 400,
            error   : true,
            response: err, 
            message : 'Club validation error.'
          });
        } else {
          res.json({
            status  : 201,
            error   : false,
            response: club,
            message : 'Club created.'
          });
        }
      });
    });

  router.route('/vp/club/:id')
    .get(function (req,res) {
      Club.findById(req.params.id)
        .exec(function(err, club) {
        if (err) {
          res.json({
            status  : 404,
            error   : true,
            response: err,
            message : 'Error getting club with id ' + req.params.id
          });
        } else {
          res.json(club);
        }
      });
    })
    .put(function (req, res) {
      return Club.findById(req.params.id, function (err, club) {
        club.name = req.body.name;
        club.logoBase64Url =  req.body.logoBase64Url;
        return club.save(function (err) {
          if (err) {
            res.json({ 
              status  : 400,
              error   : true,
              response: err, 
              message : 'Club validation error.'
            });
          } else {
            res.json({
              status  : 200,
              error   : false,
              response: club,
              message : 'Club saved.'
            });
          }
        });
      })
    })
    .delete(function (req,res) {
      var response;
      // find the data
      Club.findById(req.params.id, function(err, club) {
        if (err) {
          response = {'error' : true,'message' : 'Error fetching data'};
        } else {
          // data exists, remove it.
          Club.remove({_id : req.params.id},function(err) {
              if (err) {
                  response = {'error' : true, 'message' : 'Error deleting data'};
              } else {
                  response = {'error' : false, 'message' : 'Data associated with ' + req.params.id + ' is deleted'};
              }
              res.json(response);
          });
        }
      });
    });

  var getGames = function(req,res) {
    var filter;
    if (req.params.yyyy) {
      var year = req.params.yyyy;
      var monthIndex = parseInt(req.params.mm, 10) - 1;
      var from = new Date(year, monthIndex, 1).getTime();
      var to = new Date(year, monthIndex+1, 1).getTime();
      filter = {
        'matchDay': {
          $gte: new Date(from),
          $lt: new Date(to)
        }
      };
    } else {
      filter = {};
    }
    var response;
      Game.find(filter)
      .populate('homeTeam awayTeam')
      .sort({ matchDay: -1})
      .exec(function(err, games) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {'error' : true,'message' : 'Error fetching data'};
        } else {
            response = games;
        }
        res.json(response);
      });
    };

  router.route('/vp/games/:yyyy/:mm')
    .get(getGames);
  router.route('/vp/games')
    .get(getGames);

  router.route('/vp/game')
    .post(function(req,res) {
      var game = new Game();
      game.matchDay = req.body.matchDay;
      game.homeTeam =  req.body.homeTeam;
      game.awayTeam =  req.body.awayTeam;
      game.homeTeamGoals =  req.body.homeTeamGoals;
      game.awayTeamGoals =  req.body.awayTeamGoals;
      game.notes = req.body.notes;
      game.save(function(err) {
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
    });

  router.route('/vp/game/:id')
    .get(function (req,res) {
      Game.findById(req.params.id)
        .populate('homeTeam awayTeam')
        .exec(function(err, game) {
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
    })
    .put(function (req, res) {
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
      })
    })
    .delete(function (req,res) {
      var response;
      // find the data
      Game.findById(req.params.id, function(err, game) {
        if (err) {
          response = {'error' : true,'message' : 'Error fetching data'};
        } else {
          // data exists, remove it.
          // first remove predictions for this game
          Prediction.remove({game : req.params.id}).exec();
          Game.remove({_id : req.params.id},function(err) {
              if (err) {
                  response = {'error' : true, 'message' : 'Error deleting data'};
              } else {
                  response = {'error' : false, 'message' : 'Data associated with ' + req.params.id + ' is deleted'};
              }
              res.json(response);
          });
        }
      });
    });

  router.route('/vp/poolplayers')
    .get(function(req,res) {
      var response;
      Poolplayer.find({},function(err, poolplayers) {
      // Mongo command to fetch all data from collection.
          if (err) {
              response = {'error' : true,'message' : 'Error fetching data'};
          } else {
              response = poolplayers;
          }
          res.json(response);
      });
    });

  router.route('/vp/poolplayer')
    .post(function(req,res) {
      var poolplayer = new Poolplayer();
      poolplayer.name = req.body.name;
      poolplayer.birthday =  req.body.birthday;
      poolplayer.notes = req.body.notes;
      poolplayer.save(function(err) {
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
    });

  router.route('/vp/poolplayer/:id')
    .get(function (req,res) {
      Poolplayer.findById(req.params.id, function(err, poolplayer) {
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
    })
    .put(function (req, res) {
      return Poolplayer.findById(req.params.id, function (err, poolplayer) {
        poolplayer.name = req.body.name;
        poolplayer.birthday =  req.body.birthday;
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
      })
    })
    .delete(function (req,res) {
      var response;
      // find the data
      Poolplayer.findById(req.params.id, function(err, poolplayer) {
        if (err) {
          response = {'error' : true,'message' : 'Error fetching data'};
        } else {
          // data exists, remove it.
          // first remove predictions of this player
          Prediction.remove({poolplayer : req.params.id}).exec();
          Poolplayer.remove({_id : req.params.id},function(err) {
              if (err) {
                  response = {'error' : true, 'message' : 'Error deleting data'};
              } else {
                  response = {'error' : false, 'message' : 'Data associated with ' + req.params.id + ' is deleted'};
              }
              res.json(response);
          });
        }
      });
    });

  server.use('/',router);
  server.listen(PORT);

  console.log('Voetbalpool backend server running on PORT %s', PORT);

})(require('express'), require('path'), require('body-parser'),

    require('./src/app/mongo/db'),
    require('./src/app/mongo/models/poolplayer'),
    require('./src/app/mongo/models/club'),
    require('./src/app/mongo/models/game'),
    require('./src/app/mongo/models/prediction'),

    require('./src/app/services/calculateScores.js')

  );
