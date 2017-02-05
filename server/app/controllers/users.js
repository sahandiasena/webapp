var express = require('express');
var db = require('../models');
var passwordHash = require('password-hash');
var config = require('../../config/config');
var authy = require('authy')(config.authyApiKey);

exports.create = function (req, res) {
  var newUser = req.body;
  newUser.password = passwordHash.generate(newUser.password);

  authy.register_user(newUser.email, newUser.phone, newUser.countryCode,
    function (error, response) {
      if (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
        return;
      }
      req.body.authyId = response.user.id;
      db.User.create(newUser)
        .then(function () {
          res.status(201).json({});
        })
        .catch(function (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({message: 'User is already registered.'});
          } else {
            console.log(error);
            res.status(500).json({message: 'An error occurred. Please try again.'});
          }
        });
    });
};

exports.getUser = function (req, res) {
  var user = req.user;
  if (user) {
    res.send(200).json({
      name: user.name,
      email: user.email
    })
  } else {
    res.send(404).json({message: 'No user found for session. Please login again.'});
  }
};
