/*jshint unused:false*/
'use strict';
var traceur = require('traceur');
var Task = traceur.require(__dirname + '/../models/task.js');


exports.index = (req, res)=>{
  Task.findAllByUserId(req.user._id, tasks=>{
    res.render('tasks/index', {tasks: tasks, user: req.user, title: 'Tasks'});
  });
};

exports.newTaskForm = (req, res)=>{
  res.render('tasks/newTaskForm', {user: req.user});
};

exports.create = (req, res)=>{
  Task.create(req.user._id, req.body, task=>{
    res.redirect(`/tasks/show/${task._id.toString()}`);
  });
};

exports.show = (req, res)=>{
  Task.findById(req.params.id, task=>{
    res.render('tasks/show', {task: task, user: req.user});
  });
};

exports.complete = (req, res)=>{
  Task.findById(req.body.taskId, task=>{
    task.complete();
    res.redirect('/tasks/index');
  });
};

exports.destroy = (req, res)=>{
  Task.findById(req.body.taskId, task=>{
    task.destroy(()=>{
      res.redirect('/tasks/index');
    });
  });
};
