var middleware = require('./middleware');
var session = require('./session');
var users = require('./users');
var bodyParser = require('body-parser');

module.exports = function (app) {
  //Accept pre-flight request
  app.use(middleware.allowCrossDomain);

  // Look for session information before API requests
  app.use(middleware.loadUser);

  app.get('/users', middleware.loginRequired, users.getUser);

  app.post('/users', users.create);

  app.get('/authy/status', session.authyStatus);

  app.post('/session', session.authenticate);

  app.delete('/session', middleware.loginRequired, session.destroy);

  app.post('/authy/verify', session.verify);

  app.post('/authy/resend', session.resend);

  app.post('/authy/callback', bodyParser.json(), middleware.validateSignature, session.authyCallback);

  app.get('/authy/callback', session.authyCallbackGet);
};
