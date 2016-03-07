(function (express, bodyparser, db, PoolplayersRouter, ClubsRouter, GamesRouter, PredictionsRouter, CommonRouter) {

  var PORT = 3001;
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
  server.post('/vp/poolplayer', PoolplayersRouter.create);
  server.get('/vp/poolplayer/:id', PoolplayersRouter.get);
  server.put('/vp/poolplayer/:id', PoolplayersRouter.update);
  server.delete('/vp/poolplayer/:id', PoolplayersRouter.delete);

  // clubs routing
  server.get('/vp/clubs', ClubsRouter.list);
  server.post('/vp/club', ClubsRouter.create);
  server.get('/vp/club/:id', ClubsRouter.get);
  server.put('/vp/club/:id', ClubsRouter.update);
  server.delete('/vp/club/:id', ClubsRouter.delete);

  // games routing
  server.get('/vp/games/:yyyy/:mm', GamesRouter.listByMonth);
  server.get('/vp/games', GamesRouter.list);
  server.post('/vp/game', GamesRouter.create);
  server.get('/vp/game/:id', GamesRouter.get);
  server.put('/vp/game/:id', GamesRouter.update);
  server.delete('/vp/game/:id', GamesRouter.delete);

  // prediction routing
  server.get('/vp/predictions/:yyyy/:mm', PredictionsRouter.listByMonth);
  server.post('/vp/prediction', PredictionsRouter.create);
  server.get('/vp/prediction/:id', PredictionsRouter.get);
  server.put('/vp/prediction/:id', PredictionsRouter.update);
  server.delete('/vp/prediction/:id', PredictionsRouter.delete);

  // common routing
  server.get('/vp/months', CommonRouter.months);

  server.listen(PORT);

  console.log('Voetbalpool backend server running on PORT %s', PORT);

})(require('express'), require('body-parser'), require('./src/app/mongo/db'),

  require('./src/app/routes/poolplayers'),
  require('./src/app/routes/clubs'),
  require('./src/app/routes/games'),
  require('./src/app/routes/predictions'),
  require('./src/app/routes/common')

);
