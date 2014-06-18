'use strict';

var traceur = require('traceur');
var Task = traceur.require(__dirname + '/../models/task.js');
var Alert = traceur.require(__dirname + '/../models/alert.js');

exports.login = (req, res)=>{
  res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
};

exports.profile = (req, res)=>{
  Task.findAllByUserId(req.user._id, tasks=>{
    Alert.findAllByUserId(req.user._id, alerts=>{
      res.render('users/profile', {user: req.user, tasks: tasks, alerts: alerts, title: 'Profile'});
    });
  });
};

exports.signup = (req, res)=>{
  res.render('users/register', {message: req.flash('signupMessage'), title: 'Register'});
};

exports.logout = (req, res)=>{
  req.logout();
  res.redirect('/');
};
