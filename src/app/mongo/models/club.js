(function(mongoose) {

  var ClubSchema = new mongoose.Schema({

    'name': {
      type: String,
      required: 'Je moet de naam invullen.'
    },

    'logoBase64Url': {
      type: String,
      required: 'Je moet de base64 image url invullen.',
    }

  });

  module.exports = mongoose.model('Club', ClubSchema);

})(require('mongoose'));