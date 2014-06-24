var tasksCollection = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Task{
    static create(id, obj, func){
      var task = new Task();
      var date = new Date(obj.due);
      var newHour = date.getHours()+ 5;
      date.setHours(newHour);

      task.title = obj.title;
      task.body = obj.body;
      task.photos = [];
      task.list = [];
      task.due = date;
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
    }

    complete(){
      this.isComplete = true;
      tasksCollection.save(this, ()=>{});
    }

    setAlert(){
      this.hasAlert = true;
      tasksCollection.save(this, ()=>{});
    }

    destroy(fn){
      tasksCollection.findAndRemove({_id: this._id}, (e,count)=>{
        fn();
      });
    }// end destroy

    save(func){
      tasksCollection.save(this, (err, count)=>{
        func();
      });
    }// end save

}//end class Task
module.exports = Task;
