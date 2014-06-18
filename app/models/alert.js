var alertsCollection = global.nss.db.collection('alerts');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var async = require('async');



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
      alertsCollection.find({_id: userId, proximity: true}).toArray((err, active)=>{
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
            // changing stuff here
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

    destroy(fn){
      alertsCollection.findAndRemove({_id: this._id});
      fn();
    }// end destroy

    save(func){
      alertsCollection.save(this, (err, count)=>{
        func();
      });
    }// end save

}//end class Task
module.exports = Alert;
