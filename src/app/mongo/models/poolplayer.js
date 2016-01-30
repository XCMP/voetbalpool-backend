(function(mongoose) {

  var PoolplayerSchema = new mongoose.Schema({

    'name' : {
      type: String,
      required: 'Je moet een naam invullen.'
    },

    'birthday' : {
      type: Date,
      required: 'Je moet een geboortedatum invullen.',
      validate: [
        {
          validator: function(value) {
            return !isNaN(new Date(value).getTime());
          },
          message: 'Datum is incorrect (dd-mm-jjjj).'
        },
        {
          validator: function(value) {
            return Date.now() >= new Date(value).getTime();
          },
          message: 'Datum kan niet in de toekomst liggen.'
        }
      ]
    },

    'notes': String
    
  });

  module.exports = mongoose.model('Poolplayer', PoolplayerSchema);

})(require('mongoose'));