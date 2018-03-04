/*var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
*/
var express = require('express')
      , cfg = require('./config.json')
      , load  = require('express-load')
      , bodyParser  = require('body-parser')
      , cookieParser  = require('cookie-parser')
      , expressSession  = require('express-session')
      , methodOverride  = require('method-override')
      , compression = require('compression')
      , csurf = require('csurf')
      , error = require('./middleware/error')
      , redisAdapter = require('socket.io-redis')
      , RedisStore = require('connect-redis')(expressSession)
      , app = express()
      , server  = require('http').Server(app)
      , io  = require('socket.io')(server)
      , cookie  = cookieParser(cfg.SECRET)
      , store = new RedisStore({prefix: cfg.KEY})
      , path = require('path')
;

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine',  'ejs');
app.use(compression());
app.use(cookie);
app.use(expressSession({
  secret: cfg.SECRET, 
  name: cfg.KEY,  
  resave: true, 
  saveUninitialized:  true,
  store:  store
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:  true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), cfg.CACHE));
app.use(csurf());
app.use(function(req, res, next)
{
  res.locals._csrf = req.csrfToken();
  next();
});

io.adapter(redisAdapter(cfg.REDIS));

io.use(function(socket, next)
{
  var data = socket.request;
  cookie(data, {}, function(err)
  {
    var sessionID = data.signedCookies[cfg.KEY];
    store.get(sessionID, function(err, session)
    {
      if(err || !session)
      {
        return next(new Error('acesso negado'));
      }
      else
      {
        socket.handshake.session = session;
        return next();
      }
    })
  })
});

load('models')
  .then('controllers')
  .then('routes')
  .into(app);
load('sockets')
  .into(io);

app.use(error.notFound);
app.use(error.serverError);

server.listen(3000, function()
{
  console.log("Ntalk no ar.");
});

//fs.openSync('/tmp/app-initialized', 'w');

module.exports = app;