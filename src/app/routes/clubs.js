(function (_, Club, Game, Prediction) {

  // get /vp/clubs
  exports.list = function (req, res) {
    var response;
    Club.find({})
      .sort({ name: 1})
      .exec(function (err, clubs) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {'error' : true,'message' : 'Error fetching data'};
        } else {
            response = clubs;
        }
        res.json(response);
      });
    };

  // post /vp/club
  exports.create = function (req, res) {
    var club = new Club();
    club.name = req.body.name;
    club.logoFilename = req.body.logoFilename;
    club.save(function (err) {
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
  };

  // get /vp/club/:id
  exports.get = function (req, res) {
    Club.findById(req.params.id)
      .exec(function (err, club) {
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
  };

  // put /vp/club/:id
  exports.update = function (req, res) {
    return Club.findById(req.params.id, function (err, club) {
      club.name = req.body.name;
      club.logoFilename = req.body.logoFilename;
      club.logoBase64Url = undefined;
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
    });
  };

  // delete /vp/club/:id
  exports.delete = function (req, res) {
    var response;
    // find the data
    Club.findById(req.params.id, function (err, club) {
      if (err) {
        response = {'error' : true,'message' : 'Error fetching data'};
      } else {
        // data exists, find related games and predictions and remove them.
        Game.find().or([{homeTeam : club._id}, {awayTeam: club._id}]).exec(function (err, games) {
          _.each(games, function(game, i) {
            Game.remove({_id : game._id}).exec();
            Prediction.find({game : game._id}).exec(function (err, predictions) {
              _.each(predictions, function(prediction, i) {
                Prediction.remove({_id : prediction._id}).exec();
              });
            });
          })
        });
        // data exists, remove the club.
        Club.remove({_id : req.params.id},function (err) {
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

})(require('underscore'), require('../mongo/models/club'), require('../mongo/models/game'), require('../mongo/models/prediction'));