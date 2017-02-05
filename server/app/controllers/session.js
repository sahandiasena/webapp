var express = require('express');
var db = require('../models');
var passwordHash = require('password-hash');
var uuid = require('node-uuid');
var onetouch = require('../authy/onetouch');
var config = require('../../config/config');
var authy = require('authy')(config.authyApiKey);

exports.authenticate = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  db.User.findOne({
    where: {
      email: email
    }
  }).then(function (user) {
    if (user !== null && passwordHash.verify(password, user.password)) {
      createSessionForUser(user, false, function (session) {
        if (session.error || !session.newSession) {
          console.log(session.error);
          res.status(500).json({message: 'There was an error creating your session. Please try again.'});
        } else {
          res.status(200).json({
            token: session.newSession.token,
            authyResponse: session.authyResponse
          });
        }
      });
    } else {
      res.status(403).json({message: 'Invalid email or password.'});
    }
  }).catch(function (error) {
    console.log(error);
    res.status(500).json({message: 'An error occurred. Please try again'});
  });
};

exports.authyStatus = function (req, res) {
  var status = (req.user) ? req.user.authyStatus : 'unverified';
  if (status == 'approved') {
    req.session.confirmed = true;
    req.session.save()
      .catch(function (err) {
        console.log(err);
        res.status(500).json({message: 'There was an error validating your status.'});
      });
  }

  if (!req.session) {
    res.status(404).json({message: 'No valid session found for this user.'});
  } else {
    res.status(200).json({
      status: status,
      token: req.session.token,
      user: {
        name: req.user.name,
        email: req.user.email
      }
    });
  }
};

exports.verify = function (req, res) {
  var oneTimeCode = req.body.code;
  var session = req.session;
  var user = req.user;
  if (!session || !user) {
    res.status(404).json({message: 'No valid session found for this token.'});
    return;
  }

  authy.verify(user.authyId, oneTimeCode, function (error) {
    if (error) {
      console.log(error);
      res.status(400).json({message: 'Invalid confirmation code.'});
    }
    else {
      req.session.confirmed = true;
      req.session.save()
        .then(function () {
          res.status(200).json({
            token: session.token,
            user: {
              name: user.name,
              email: user.email
            }
          });
        })
        .catch(function (err) {
          console.log(err);
          res.status(500).json({message: 'There was an error validating your session.'});
        });
    }
  });
};

exports.destroy = function (req, res) {
  req.session && req.session.destroy()
    .then(function () {
      res.status(202).json({});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({message: 'An error occurred. Please try again.'})
    })
};

exports.authyCallback = function(req, res) {
  var authyId = req.body.authy_id;

  db.User.findOne({
    where: {
      authyId: authyId
    }
  }).then(function (user) {
      if (!user) {
        res.status(403).json({message: 'Invalid email or password.'})
      } else {
        user.authyStatus = req.body.status;
        user.save();
        res.end();
      }
  }).catch(function () {
    res.status(500).json('An error occured. Please try again.')
  });
};

//used to validate callback url with authy.
exports.authyCallbackGet = function (req, res) {
  res.send(200).end();
};

exports.resend = function (req, res) {
  if (!req.user){
    res.status(404).json({message: 'No user found for this session, please log in again.'});
    return;
  }

  authy.request_sms(req.user.authyId, function(err) {
      if (err) {
        res.status(500).json({message: 'No user found for this session, please log in again.'});
      } else {
        res.status(200).end();
      }
  });
};

function createSessionForUser(user, conf, cb) {
  var newSession = {
    userId: user.userId,
    confirmed: conf,
    token: uuid.v1()
  };

  if (!conf) {
    sendOneTouch(user, function (error, authyResponse) {
      if (error) {
        return cb({newSession, error});
      }
      save(authyResponse);
    });
  } else {
    save();
  }

  function save(authyResponse) {
    db.Session.create(newSession)
      .then(function (newSession) {
        cb({newSession, authyResponse})
      })
      .catch(function (error) {
        cb({error});
      })
  }
}

function sendOneTouch(user, cb) {
  user.authyStatus = 'unverified';
  user.save();

  onetouch.sendApprovalRequest(user.authyId, {
    message: 'Request to Login to WebApp',
    email: user.email
  }, function (err, authyres) {
    if (err && err.success != undefined) {
      authyres = err;
      err = null;
    }
    cb(err, authyres);
  });
}
