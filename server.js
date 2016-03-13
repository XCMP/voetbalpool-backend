(function (express, bodyparser, db, PoolplayersRouter, ClubsRouter, GamesRouter, PredictionsRouter, CommonRouter, HealthRouter) {

  var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3001
  var IP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
  
  var server = express();

  server.use(bodyparser.json());
  server.use(bodyparser.urlencoded({'extended' : false}));
  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // ROUTING
  // poolplayers routing
  server.get('/vp/poolplayers', PoolplayersRouter.list);
  server.post('/vp/poolplayers', PoolplayersRouter.create);
  server.get('/vp/poolplayers/:id', PoolplayersRouter.get);
  server.put('/vp/poolplayers/:id', PoolplayersRouter.update);
  server.delete('/vp/poolplayers/:id', PoolplayersRouter.delete);

  // clubs routing
  server.get('/vp/clubs', ClubsRouter.list);
  server.post('/vp/clubs', ClubsRouter.create);
  server.get('/vp/clubs/:id', ClubsRouter.get);
  server.put('/vp/clubs/:id', ClubsRouter.update);
  server.delete('/vp/clubs/:id', ClubsRouter.delete);

  // games routing
  server.get('/vp/games/:yyyy/:mm', GamesRouter.listByMonth);
  server.get('/vp/games', GamesRouter.list);
  server.post('/vp/games', GamesRouter.create);
  server.get('/vp/games/:id', GamesRouter.get);
  server.put('/vp/games/:id', GamesRouter.update);
  server.delete('/vp/games/:id', GamesRouter.delete);

  // prediction routing
  server.get('/vp/predictions/:yyyy/:mm', PredictionsRouter.listByMonth);
  server.post('/vp/predictions', PredictionsRouter.create);
  server.get('/vp/predictions/:id', PredictionsRouter.get);
  server.put('/vp/predictions/:id', PredictionsRouter.update);
  server.delete('/vp/predictions/:id', PredictionsRouter.delete);

  // common routing
  server.get('/vp/months', CommonRouter.months);

  // health check by OpenShift
  server.get('/health', HealthRouter.health);

  server.listen(PORT, IP);

  console.log('Voetbalpool backend server running on %s:%s', IP, PORT);

})(require('express'), require('body-parser'), require('./src/app/mongo/db'),

  require('./src/app/routes/poolplayers'),
  require('./src/app/routes/clubs'),
  require('./src/app/routes/games'),
  require('./src/app/routes/predictions'),
  require('./src/app/routes/common'),
  require('./src/app/routes/health')

);
