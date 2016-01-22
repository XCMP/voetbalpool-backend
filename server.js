(function(express, path, bodyparser, db, Poolplayer, Club, Game) {

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
              message : 'Poolpayer created.'
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
    require('./src/app/mongo/models/game')
  );
