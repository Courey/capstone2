/*jshint unused:false*/
'use strict';
var traceur = require('traceur');
var Alert = traceur.require(__dirname + '/../models/alert.js');
var exec = require('child_process').exec;
var _ = require('lodash');

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
  Alert.findAllValidAlertsByUserId(req.user._id, alerts=>{
    //set timout here
    var timeOuts = [];
    clearTimeout(timeOuts);
    _.forEach(alerts, alert=>{
      //executeAlert(alert.task)
      timeOuts[alert.id] = setTimeout(function(){
        var child;
        var task = `say ${alert.task}`;
        child = exec(task,
        function(err, stdout, stderr){
          console.log('stdout:'+stdout);
          console.log('stderr'+stderr);
          if(err !== null){
            console.log(err);
          }
        });
      }, alert.miliseconds);
      console.log(timeOuts[alert.id]);
    });

    // alerts.each(alert=>{
    //   timeOuts[alert.id] = setTimeout(executeAlert(alert.task), alert.miliseconds);
    // });
    res.send(alerts);
  });
};

function executeAlert(task){
  var child;
  console.log(task);
  task = `say ${task}`;
  child = exec(task,
  function(err, stdout, stderr){
    console.log('stdout:'+stdout);
    console.log('stderr'+stderr);
    if(err !== null){
      console.log(err);
    }
  });
}// end executeAlert

function clearAllTimeouts(timeOuts){
  _.forEach(timeOuts, timer=>{
    clearTimeout(timeOuts[timer._id]);
  });
}

// /* declare an array for all the timeOuts*/
// var timeOuts = new Array();
//
// /* then instead of a normal timeOut call do this:*/
// timeOuts["uniqueId"] = setTimeout('whateverYouDo("fooValue")',1000);
//
// /* To clear them all, just call this */
// function clearTimeouts(){
//   for( key in timeOuts ){
//     clearTimeout(timeOuts[key]);
//   }
// }

//
// /* Clear just one of the timeOuts this way: */
// clearTimeout(timeOuts["uniqueId"]);
