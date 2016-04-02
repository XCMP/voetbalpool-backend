(function (mongoose) {

  var GameSchema = new mongoose.Schema({

    'matchDay': {
      type: Date,
      required: 'Je moet een speeldatum invullen.',
      validate: [
        {
          validator: function (value) {
            return !isNaN(new Date(value).getTime());
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
      default: null,
      validate: [
        {
          validator: function (value) {
            return (this.awayTeamGoals !== null && value !== null) || (this.awayTeamGoals === null && value === null);
          },
          message: 'Je moet de score volledig invullen.'
        }
      ]
    },

    'awayTeamGoals': {
      type: Number,
      default: null,
      validate: [
        {
          validator: function (value) {
            return (this.homeTeamGoals !== null && value !== null) || (this.homeTeamGoals === null && value === null);
          },
          message: 'Je moet de score volledig invullen.'
        }
      ]
    },

    'notes': String

  });

  GameSchema.index({matchDay: 1, homeTeam: 1, awayTeam: 1}, {unique: true});

  module.exports = mongoose.model('Game', GameSchema);

})(require('mongoose'));