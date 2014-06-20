'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var tasks = traceur.require(__dirname + '/../routes/tasks.js');
  var alerts = traceur.require(__dirname + '/../routes/alerts.js');

  var passport = require('passport');
  require('../config/passport')(passport);

  app.get('/', dbg, home.index);

  app.get('/login', dbg, users.login);
  app.get('/signup', dbg, users.signup);
  app.get('/profile', dbg, isLoggedIn, users.profile);
  app.get('/logout', dbg, users.logout);

  app.get('/tasks/index', dbg, tasks.index);
  app.get('/tasks/new', dbg, tasks.newTaskForm);
  app.post('/tasks/new', dbg, tasks.create);
  app.get('/tasks/show/:id', dbg, tasks.show);

  app.get('/alerts/index', dbg, alerts.index);
  app.get('/alerts/new', dbg, alerts.newAlertForm);
  app.post('/alerts/new', dbg, alerts.create);
  app.get('/alerts/show/:id', dbg, alerts.show);
  app.put('/alerts/load', dbg, alerts.load);
  app.put('/alerts/changeStatus/:mood', dbg, alerts.changeMood);

  app.get('/alerts/test', dbg, alerts.proximityAlerts);
  app.post('/alerts/proximity', dbg, alerts.enableProximity);

  app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

  app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// FACEBOOK ROUTES
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	// TWITTER ROUTES
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

  console.log('Routes Loaded');
  fn();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
