(function(mongoose) {

  mongoose.connect('mongodb://localhost:27017/voetbalpool');

  var PoolplayerSchema = new mongoose.Schema({
      'name' : {
        type: String,
        validate: {
          validator: function(value) {
            return value !== '';
          },
          message: 'Naam is verplicht'
        }
      },
      'birthday' : {
        type: Date,
        validate: {
          validator: function(value) {
            //var date = new Date(_utils.toDate(value));
            var date = new Date(value);
            return isNaN(date.getTime);
          },
          message: 'Datum is incorrect (dd-mm-jjjj)'
        }
      },
      'notes': String
  });

  module.exports = mongoose.model('Poolplayer',PoolplayerSchema);

})(require('mongoose'));