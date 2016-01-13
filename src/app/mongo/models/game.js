(function(mongoose) {

  var GameSchema = new mongoose.Schema({

    'date': {
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
      type: String,
      required: 'Je moet de thuisspelende club invullen.',
      validate: [
        {
          validator: function(value) {
            // TODO check against list of teams
            return true;
          },
          message: 'Kies een culb uit de lijst.'
        }
      ]
    },

    'awayTeam': {
      type: String,
      required: 'Je moet de uitspelende club invullen.',
      validate: [
        {
          validator: function(value) {
            // TODO check against list of teams
            return true;
          },
          message: 'Kies een culb uit de lijst.'
        }
      ]
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