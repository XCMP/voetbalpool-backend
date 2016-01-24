(function(mongoose) {

  var GameSchema = new mongoose.Schema({

    'matchDay': {
      type: Date,
      required: 'Je moet een speeldatum invullen.',
      validate: [
        {
          validator: function(value) {
            return !isNaN(new Date(value).getTime());
            //return (value.length == 16 && /^\d+$/.test(value.replace(/[\/, ,:]/g, '')) && !isNaN(new Date(value).getTime()));
          },
          message: 'Speeldatum is incorrect (dd-mm-jjjj hh:mm).'
        }
      ]
    },

    'homeTeam': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: 'Je moet een thuis spelend team invullen.',
    },

    'awayTeam': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: 'Je moet een uit spelend team invullen.',
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