(function(express, path, bodyparser, Poolplayer) {

  var PORT = 3001;
  var server = express();
  var router = express.Router();

  server.use(bodyparser.json());
  server.use(bodyparser.urlencoded({"extended" : false}));
  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  router.route("/vp/poolplayers")
    .get(function(req,res){
      var response = {};
      Poolplayer.find({},function(err,data){
      // Mongo command to fetch all data from collection.
          if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
          } else {
              response = {"error" : false,"message" : data};
          }
          res.json(response.message);
      });
    });

  router.route("/vp/poolplayer")
    .post(function(req,res){
      var poolplayer = new Poolplayer();
      poolplayer.name = req.body.name;
      poolplayer.birthday =  req.body.birthday;
      poolplayer.notes = req.body.notes;
      poolplayer.save(function(err){
        if (err) {
          res.json({ 
            status  : 400,
            error   : true,
            response: err, 
            message : 'Poolpayer validation error.'
          });
        } else {
          res.json({
            status  : 201,
            error   : false,
            response: poolplayer,
            message : 'Poolpayer created.'
          });
        }
      });
    });

  router.route("/vp/poolplayer/:id")
    .delete(function(req,res){
      var response = {};
      // find the data
      Poolplayer.findById(req.params.id,function(err,data){
          if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
          } else {
              // data exists, remove it.
              Poolplayer.remove({_id : req.params.id},function(err){
                  if(err) {
                      response = {"error" : true,"message" : "Error deleting data"};
                  } else {
                      response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                  }
                  res.json(response);
              });
          }
      });
    });

  server.use('/',router);

  server.listen(PORT);
  console.log('Voetbalpool backend server running on PORT %s', PORT);

})(require('express'), require('path'), require('body-parser'), require('./src/app/models/mongo/poolplayer'));
