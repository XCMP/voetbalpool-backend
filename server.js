(function(express, path, bodyparser, 

        db, Poolplayer, Club, Game, Prediction

  ) {

  var PORT = 3001;
  var server = express();
  var router = express.Router();

  server.use(bodyparser.json());
  server.use(bodyparser.urlencoded({"extended" : false}));
  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  router.route("/vp/predictions")
    .get(function(req,res){
      var response;
      Prediction.find({})
      .populate('poolplayer')
      .populate({
        path: 'game',
        populate: {path:'homeTeam awayTeam', model:'Club'}
      })
      .exec(function(err, predictions){
        // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = predictions;
        }
        res.json(response);
      });
    });

  router.route("/vp/clubs")
    .get(function(req,res){
      var response;
      Club.find({},function(err, clubs){
        // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = clubs;
        }
        res.json(response);
      });
    });

  router.route("/vp/club")
    .post(function(req,res){
      var club = new Club();
      club.name = req.body.name;
      club.logoBase64Url =  req.body.logoBase64Url;
      club.save(function(err){
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

  router.route("/vp/club/:id")
    .get(function (req,res){
      Club.findById(req.params.id)
        .exec(function(err, club){
        if(err) {
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
    .put(function (req, res){
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
    .delete(function (req,res){
      var response;
      // find the data
      Club.findById(req.params.id, function(err, club){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
        } else {
          // data exists, remove it.
          Club.remove({_id : req.params.id},function(err){
              if(err) {
                  response = {"error" : true, "message" : "Error deleting data"};
              } else {
                  response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
              }
              res.json(response);
          });
        }
      });
    });

  router.route("/vp/games")
    .get(function(req,res) {
      var response;
      Game.find({})
      .populate('homeTeam awayTeam')
      .sort({ matchDay: -1})
      .exec(function(err, games){
        // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = games;
        }
        res.json(response);
      });
    });

  router.route("/vp/game")
    .post(function(req,res){
      var game = new Game();
      game.matchDay = req.body.matchDay;
      game.homeTeam =  req.body.homeTeam;
      game.awayTeam =  req.body.awayTeam;
      game.homeTeamGoals =  req.body.homeTeamGoals;
      game.awayTeamGoals =  req.body.awayTeamGoals;
      game.notes = req.body.notes;
      game.save(function(err){
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

  router.route("/vp/game/:id")
    .get(function (req,res){
      Game.findById(req.params.id)
        .populate('homeTeam awayTeam')
        .exec(function(err, game){
        if(err) {
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
    .put(function (req, res){
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
          }
        });
      })
    })
    .delete(function (req,res){
      var response;
      // find the data
      Game.findById(req.params.id, function(err, game){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
        } else {
          // data exists, remove it.
          Game.remove({_id : req.params.id},function(err){
              if(err) {
                  response = {"error" : true, "message" : "Error deleting data"};
              } else {
                  response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
              }
              res.json(response);
          });
        }
      });
    });

  router.route("/vp/poolplayers")
    .get(function(req,res){
      var response;
      Poolplayer.find({},function(err, poolplayers){
      // Mongo command to fetch all data from collection.
          if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
          } else {
              response = poolplayers;
          }
          res.json(response);
      });
    });

  router.route("/vp/poolplayer")
    .post(function(req,res){
      var poolplayer = new Poolplayer();
      poolplayer.name = req.body.name;
      poolplayer.birthday =  req.body.birthday;
      poolplayer.notes = req.body.notes;
      poolplayer.save(function(err){
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

  router.route("/vp/poolplayer/:id")
    .get(function (req,res){
      Poolplayer.findById(req.params.id, function(err, poolplayer){
        if(err) {
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
    .put(function (req, res){
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
    .delete(function (req,res){
      var response;
      // find the data
      Poolplayer.findById(req.params.id, function(err, poolplayer){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
        } else {
          // data exists, remove it.
          Poolplayer.remove({_id : req.params.id},function(err){
              if(err) {
                  response = {"error" : true, "message" : "Error deleting data"};
              } else {
                  response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
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
    require('./src/app/mongo/models/prediction')

  );
