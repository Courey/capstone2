/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var bcrypt = require('bcrypt');

class User {
  constructor(){

    this.local = {
      email:    String,
      password: String
    };

    this.facebook = {
      id:       String,
      token:    String,
      email:    String,
      name:     String
    };

    this.twitter = {
      id:       String,
      token:    String,
      displayName: String,
      username:   String
    };

  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }

  generateHash(password) {
    return bcrypt.hashSync(password, 8);
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.local.password);
  }

  static findById(id, fn){
    id = Mongo.ObjectID(id);
    userCollection.findOne({_id: id}, (err, user)=>{
      fn(null, user);
    });
  }


}

module.exports = User;
