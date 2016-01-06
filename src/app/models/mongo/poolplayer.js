(function(mongoose) {

  mongoose.connect('mongodb://localhost:27017/voetbalpool');

  var PoolplayerSchema = new mongoose.Schema({
      'name' : {
        type: String,
        required: 'Je moet een naam invullen.'
      },
      'birthday' : {
        type: String, // TODO try making this a Date and prevent Casting before validation
        required: 'Je moet een geboortedatum invullen.',
        validate: {
          validator: function(value) {
            return (value.length == 10 && !isNaN(new Date(value).getTime()));
          },
          message: 'Datum is incorrect (dd-mm-jjjj)'
        }
      },
      'notes': String
  });

  module.exports = mongoose.model('Poolplayer',PoolplayerSchema);

})(require('mongoose'));