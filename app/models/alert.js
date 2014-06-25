var alertsCollection = global.nss.db.collection('alerts');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var async = require('async');
var exec = require('child_process').exec;

class Alert{
  static create(id, obj, func){
    var date = new Date(obj.dateTime);
    var newHour = date.getHours()+ 5;
    date.setHours(newHour);
    var alert = new Alert();
    alert.task = obj.task;
    alert.dateTime = date;
    alert.proximity = false;
    if(typeof id === 'string'){
      if(id.length !== 24){func(null); return;}
      id = Mongo.ObjectID(id);
      alert.userId = id;
    }else{
      alert.userId = id;
    }
    alertsCollection.save(alert, ()=>{
      func(alert);
    });
  }// end static create

  static findById(id, fn){
    Base.findById(id, alertsCollection, Alert, fn);
  }// end findById

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, alertsCollection, Alert, fn);
  }// end static findByUserId

  static findAllActiveByUserId(userId, fn){
    if(typeof userId === 'string'){
      userId = Mongo.ObjectID(userId);
    }

    alertsCollection.find({userId: userId}).toArray((err, active)=>{
      active = _.filter(active, 'proximity');
      active = active.map(a=>_.create(Alert.prototype, a));
      fn(active);
    });
  }

  static findAllValidAlertsByUserId(userId, func){
    Alert.findAllByUserId(userId, alerts=>{
      var alertObj = {};
      async.each(alerts, (alert, func)=>{
        var date = new Date();
        var dateDifference = alert.dateTime-date;
        var alertId = alert._id.toString();
        if(dateDifference > 0){
          alertObj[alertId]= {id: alertId, miliseconds: dateDifference, task: alert.task};
        }

        func();
      }, err=>{
        if(err){
          console.log('you done fucked it up again');
        }
        else{
          func(alertObj);
        }
      });
    });
  }

  static loadAlerts(userId){
    Alert.findAllValidAlertsByUserId(userId, alerts=>{
      var timeOuts = [];
      clearAllTimeouts(timeOuts);
      _.forEach(alerts, alert=>{
        timeOuts[alert.id] = setTimeout(function(){
          var child;
          var task = alert.task.replace(/([!?'`~@#$%^&*`])/g,'');
          task = `say ${task}`;
          child = exec(task,
          function(err, stdout, stderr){
            console.log('stdout:'+stdout);
            console.log('stderr'+stderr);
            if(err !== null){
              console.log(err);
            }
          });
        }, alert.miliseconds);
      });
    });
  }

  enableProximity(){
    this.proximity = true;
    alertsCollection.save(this, ()=>{});
  }

  destroy(fn){
    alertsCollection.findAndRemove({_id: this._id}, (err, alert)=>{
      fn();
    });
  }// end destroy

  save(func){
    alertsCollection.save(this, (err, count)=>{
      func();
    });
  }// end save

}//end class Task
module.exports = Alert;

function clearAllTimeouts(timeOuts){
  'use strict';
  _.forEach(timeOuts, timer=>{
    clearTimeout(timeOuts[timer._id]);
  });
}
