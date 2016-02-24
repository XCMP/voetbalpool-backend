(function(mongoose, _,

  Game,
  Prediction
) {

  var calculateScores = function(gameId) {
    Prediction.find({
        'game': gameId
      })
      .populate('poolplayer')
      .populate({
        path: 'game'
      })
      .exec(function(err, predictions) {
        _.each(predictions, function(prediction, j) {
          var score = null;
          if (prediction.game.homeTeamGoals !== null && prediction.game.awayTeamGoals !== null) {
            score = 0;
            var homeTeamScoredGoals    = prediction.game.homeTeamGoals;
            var awayTeamScoredGoals    = prediction.game.awayTeamGoals;
            var homeTeamPredictedGoals = prediction.homeTeamGoals;
            var awayTeamPredictedGoals = prediction.awayTeamGoals;
            if (
                (homeTeamScoredGoals  >  awayTeamScoredGoals && homeTeamPredictedGoals  >  awayTeamPredictedGoals) ||
                (homeTeamScoredGoals  <  awayTeamScoredGoals && homeTeamPredictedGoals  <  awayTeamPredictedGoals) ||
                (homeTeamScoredGoals === awayTeamScoredGoals && homeTeamPredictedGoals === awayTeamPredictedGoals)
              ) {
              score = score + 5;
            }
            if (homeTeamScoredGoals === homeTeamPredictedGoals) {
              score = score + 2;
            }
            if (awayTeamScoredGoals === awayTeamPredictedGoals) {
              score = score + 2;
            }
            if ((homeTeamScoredGoals - awayTeamScoredGoals) === (homeTeamPredictedGoals - awayTeamPredictedGoals)) {
              score = score + 1;
            }
          }
          prediction.score = score;
          prediction.save(function(err){
            if (err) {
              console.log('Prediction saving score error:', err);
            }
          });
        });
      });
    };

  module.exports = calculateScores;

})(require('mongoose'), require('underscore'),

    require('../mongo/models/game'),
    require('../mongo/models/prediction')
);