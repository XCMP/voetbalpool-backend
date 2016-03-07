(function (Game) {

  // get /vp/prediction/months
  exports.months = function (req, res) {
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
    .exec(function (err, games) {
      // Mongo command to fetch all data from collection.
      if (err) {
          response = {'error' : true, 'message' : 'Error fetching data'};
      } else {
          response = games;
      }
      res.json(response);
    });
  };

})(require('../mongo/models/game'));