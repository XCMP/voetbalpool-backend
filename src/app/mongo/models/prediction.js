(function(mongoose) {

  var PredictionSchema = new mongoose.Schema({

    'poolplayer': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poolplayer',
        required: 'Je moet een speler kiezen.',
    },

    'game': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: 'Je moet een wedstrijd kiezen.',
    },

    'homeTeamGoals': {
      type: Number,
      required: 'Je moet de score helemaal invullen.'
    },

    'awayTeamGoals': {
      type: Number,
      required: 'Je moet de score helemaal invullen.'
    },

    'score': {
      type: Number,
      default: null
    }

  });

  PredictionSchema.index({poolplayer: 1, game: 1}, {unique: true});

  module.exports = mongoose.model('Prediction', PredictionSchema);

})(require('mongoose'));