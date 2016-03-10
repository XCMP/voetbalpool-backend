(function (mongoose) {

  var MONGO_CONNECTION_STRING = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017';
  var MONGO_DB_NAME = process.env.OPENSHIFT_GEAR_NAME || 'voetbalpool';
  var dbURI = MONGO_CONNECTION_STRING + '/' + MONGO_DB_NAME;

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
  process.on('SIGINT', function () {  
    mongoose.connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  });

}(require('mongoose')));