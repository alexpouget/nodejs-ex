var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
           User.find(function (err, post) {
                         if (err) return next(err);
                     res.json(post);
                             }).populate('amis', 'pseudo');
           });


/* GET /todos/id */
router.get('/:id', function(req, res, next) {
           User.findById(req.params.id, function (err, post){
                         if (err) return next(err);
                         res.json(post);
                         }).populate('amis', 'pseudo');
           });

// Post exemple
router.post('/', function(req, res, next) {
            User.create(req.body, function (err, post) {
                        if (err) return next(err);
                        res.json(post);
                        });
            });


/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
           User(req.params.id, req.body, function (err, post) {
                                  if (err) return next(err);
                                  res.json(post);
                                  });
           });

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
              User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
                });
              });

module.exports = router;
