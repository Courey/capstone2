'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'Desk Beacon', user: req.user});
};
