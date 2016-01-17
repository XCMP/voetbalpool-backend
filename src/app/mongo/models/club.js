(function(mongoose) {

  var ClubSchema = new mongoose.Schema({

    'name': {
      type: String,
      required: 'Je moet de naam invullen.'
    },

    'logo': {
      type: String,
      required: 'Je moet de Base64 image url invullen.',
    }

  });

  module.exports = mongoose.model('Club', ClubSchema);

})(require('mongoose'));