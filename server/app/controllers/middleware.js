var db = require('../models');
var config = require('../../config/config');
var crypto = require('crypto');
var qs = require('qs');

exports.allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-TOKEN');

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

exports.loadUser = function (req, res, next) {
  var token = req.get('X-API-TOKEN');
  if (!token) return next();

  db.Session.findOne({
    where: {
      token: token
    }
  }).then(function (session) {
    if (!session) return next();

    req.session = session;

    db.User.findById(session.userId)
      .then(function (user) {
        req.user = user;
        return next();
      })
      .catch(function () {
        return next();
      })
  }).catch(function (err) {
    console.log(err);
    req.status(500).json({message: 'An error occurred.'});
  })
};

exports.loginRequired = function (req, res, next) {
  if (!req.session || !req.session.confirmed) {
    res.status(403).json({message: 'Your session has expired - please log in again.'});
  } else {
    next();
  }
};

function sortObject(object) {
  var sortedObj = {};
  var keys = Object.keys(object).sort();

  for (var index in keys) {
    var key = keys[index];
    if (typeof object[key] == 'object' && !(object[key] instanceof Array) && object[key] != null) {
      sortedObj[key] = sortObject(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  }
  return sortedObj;
}

exports.validateSignature = function (req, res, next) {
  var apiKey = config.authyApiKey;

  var url = req.protocol + "://" + req.hostname + ":" + req.socket.localPort + req.url;
  var method = req.method;
  var params = req.body;

  // Sort the params.
  var sorted_params = qs.stringify(params).split("&").sort().join("&").replace(/%20/g, '+');

  var nonce = req.headers["x-authy-signature-nonce"];
  var data = nonce + "|" + method + "|" + url + "|" + sorted_params;

  var mine = crypto.createHmac('sha256', apiKey).update(data).digest('base64');
  var theirs = req.headers["x-authy-signature"];
  if (theirs != mine) {
    res.status(401).send({
      status: 401,
      message: "This request is unsigned."
    });
  } else {
    next();
  }
};
