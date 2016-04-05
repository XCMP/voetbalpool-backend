(function (mongoose) {

  var ClubSchema = new mongoose.Schema({

    'name': {
      type: String,
      required: 'Je moet de naam invullen.'
    },

    'logoBase64Url': {
      type: String,
      default: undefined
    },

    'logoFilename': {
      type: String,
      required: 'Je moet de bestandsnaam van het logo invullen.',
    }

  });

  ClubSchema.index({name: 1}, {unique: true});

  module.exports = mongoose.model('Club', ClubSchema);

})(require('mongoose'));