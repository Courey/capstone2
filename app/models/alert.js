var alertsCollection = global.nss.db.collection('alerts');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');


class Alert{
    static create(id, obj, func){
      var alert = new Alert();
      alert.task = obj.task;
      alert.dateTime = new Date(obj.dateTime);
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
