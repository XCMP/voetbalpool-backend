(function(mongoose) {

  var GameSchema = new mongoose.Schema({

    'matchDay': {
      type: String,
      required: 'Je moet een speeldatum invullen.',
      validate: [
        {
          validator: function(value) {
            return (value.length == 10 && /^\d+$/.test(value.replace(/\//g, '')) && !isNaN(new Date(value).getTime()));
          },
          message: 'Speeldatum is incorrect (dd-mm-jjjj).'
        }
      ]
    },

    'homeTeam': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },

    'awayTeam': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },

    'homeTeamGoals': {
      type: Number,
      default: null
    },

    'awayTeamGoals': {
      type: Number,
      default: null
    },

    'notes': String

  });

  module.exports = mongoose.model('Game', GameSchema);

})(require('mongoose'));