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
      validate: [
        {
          validator: function(value) {
            return (value.length == 10 && /^\d+$/.test(value.replace(/\//g, '')) && !isNaN(new Date(value).getTime()));
          },
          message: 'Datum is incorrect (dd-mm-jjjj)'
        },
        {
          validator: function(value) {
            return Date.now() >= new Date(value).getTime();
          },
          message: 'Datum kan niet in de toekomst liggen'
        }
      ]
    },

    'notes': String
    
  });

  module.exports = mongoose.model('Poolplayer',PoolplayerSchema);

})(require('mongoose'));