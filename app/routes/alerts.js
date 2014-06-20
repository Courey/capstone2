/*jshint unused:false*/


'use strict';
var traceur = require('traceur');
var Alert = traceur.require(__dirname + '/../models/alert.js');
var _ = require('lodash');
var setProximityAlerts = require('../arduino/arduino').setProximityAlerts;
var setMood = require('../arduino/arduino').setMood;


exports.index = (req, res)=>{
  Alert.findAllByUserId(req.params.id, alerts=>{
    res.render('alerts/index', {alerts: alerts, user: req.user, title: 'Tasks'});
  });
};

exports.newAlertForm = (req, res)=>{
  res.render('alerts/newAlertForm', {user: req.user});
};

exports.create = (req, res)=>{
  Alert.create(req.user._id, req.body, alert=>{
    res.redirect(`/alerts/show/${alert._id.toString()}`);
  });
};

exports.show = (req, res)=>{
  Alert.findById(req.params.id, alert=>{
    res.render('alerts/show', {alert: alert, user: req.user});
  });
};

exports.load = (req, res)=>{
  Alert.loadAlerts(req.user._id);
};

exports.enableProximity = (req, res)=>{
  Alert.findById(req.body.alertId, alert=>{
    alert.enableProximity();
  });
};

exports.changeMood = (req, res)=>{
  setMood(req.params.mood);
};

exports.proximityAlerts = (req, res)=>{
  Alert.findAllActiveByUserId(req.user._id, alerts=>{
    alerts = alerts.map(alert=>{
      return alert.task;
    });
    setProximityAlerts(alerts);
    console.log(alerts);
  });
};
