(function(mongoose) {

  var dbURI = 'mongodb://localhost:27017/voetbalpool';

  mongoose.connect(dbURI);

  mongoose.connection.on('connected', function () {  
    console.info('Mongoose default connection open to ' + dbURI);
  }); 

  mongoose.connection.on('error',function (err) {  
    console.error('Mongoose default connection error: ' + err);
  }); 

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {  
    console.info('Mongoose default connection disconnected'); 
  });

  // If the Node process ends, close the Mongoose connection 
  process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  });

}(require('mongoose')));