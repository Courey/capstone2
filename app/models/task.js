var tasksCollection = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
//var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Task{
    static create(id, obj, func){
      var task = new Task();
      task.title = obj.title;
      task.body = obj.body;
      task.photos = [];
      task.list = [];
      task.due = new Date(obj.due);
      task.color = obj.color;
      task.isComplete = false;
      task.hasAlert = false;
      if(typeof id === 'string'){
        if(id.length !== 24){func(null); return;}
        id = Mongo.ObjectID(id);
        task.userId = id;
      }else{
        task.userId = id;
      }
      tasksCollection.save(task, ()=>{
        func(task);
      });
    }// end static create

    static findById(id, fn){
      Base.findById(id, tasksCollection, Task, fn);
    }// end findById

    static findAllByUserId(userId, fn){
      Base.findAllByUserId(userId, tasksCollection, Task, fn);
    }//

    // static findByTaskId(id, func){
    //   if(typeof id === 'string'){
    //   if(id.length !== 24){func(null); return;}
    //       id = Mongo.ObjectID(id);
    //     }
    //   tasks.findOne({_id: id}, (error, result)=>{
    //     result = _.create(Task.prototype, result);
    //     func(result);
    //   });
    // }// end findById
    //
    // static findByUserId(id, func){
    //   tasks.find({userId: id}).toArray((err, taskArray)=>{
    //     func(taskArray);
    //   });
    // }// end static findByUserId

    complete(){
      this.isComplete = true;
    }

    destroy(fn){
      tasksCollection.findAndRemove({_id: this._id});
      fn();
    }// end destroy

    save(func){
      tasksCollection.save(this, (err, count)=>{
        func();
      });
    }// end save

}//end class Task
module.exports = Task;
