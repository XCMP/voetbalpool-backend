(function (mongoose) {

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
          validator: function (value) {
            return !isNaN(new Date(value).getTime());
          },
          message: 'Datum is incorrect (dd-mm-jjjj).'
        },
        {
          validator: function (value) {
            return Date.now() >= new Date(value).getTime();
          },
          message: 'Datum kan niet in de toekomst liggen.'
        }
      ]
    },

    'color' : {
      type: String,
      required: 'Je moet een kleur invullen.',
      validate: [
        {
          validator: function (value) {
            return value.startsWith('#');
          },
          message: 'Kleur moet beginnen met een \'#\'.'
        },
        {
          validator: function (value) {
            return value.length == 7;
          },
          message: 'Kleur als volgt invullen: #23EE44.'
        }
      ]
    },

    'notes': String
    
  });

  PoolplayerSchema.index({name: 1}, {unique: true});
  PoolplayerSchema.index({color: 1}, {unique: true});

  module.exports = mongoose.model('Poolplayer', PoolplayerSchema);

})(require('mongoose'));