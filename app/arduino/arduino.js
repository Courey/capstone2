/*jshint unused:false*/
'use strict';

var _ = require('lodash');
var exec = require('child_process').exec;
var five = require('johnny-five'),
  board, motion, led;
var mood;
var alerts = [];

board = new five.Board();

board.on('ready', function() {

  motion = new five.IR.Motion(13);

  motion.on('calibrated', function(err, ts) {
    console.log('calibrated', ts);
  });

  motion.on('motionstart', function(err, ts) {
    console.log(alerts);
    console.log('motionstart', ts);
    if(alerts[0]){
        var say = 'say "King of the Galactic Empire, you have'+alerts+'"';
        exec(say);
        alerts = [];
    }
  });

  motion.on('motionend', function(err, ts) {
    console.log('motionend', ts);
  });

  led= new five.Led({
    pin: 4
  });
  led.on();


});

function setMood(userMood){
  mood = userMood;
  if(mood){
    console.log(mood);
    if(led){
      led.off();
    }
    switch(mood){
    case 'bad':
      led= new five.Led({
        pin: 5
      });
        led.on();
        mood= '';
      break;

    case 'busy':
      led= new five.Led({
        pin: 6
      });
      led.on();
      mood= '';
      break;

    case 'good':
      led= new five.Led({
        pin: 7
      });
      led.on();
      mood= '';
    }

  }else{
    led= new five.Led({
      pin: 4
    });
    led.on();
  }
}

function setProximityAlerts(alertsArr){
  alerts = alertsArr;
}

exports.setMood = setMood;
exports.setProximityAlerts = setProximityAlerts;
