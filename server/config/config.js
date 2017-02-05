var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 4000,
    db: 'sqlite://localhost/server-development',
    storage: rootPath + '/data/server-development',
    authyApiKey: '3MP4jFpnxhur2NnjY1aoUL5V0zPypoAn'
  },

  test: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 4000,
    db: 'sqlite://localhost/server-test',
    storage: rootPath + '/data/server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 4000,
    db: 'sqlite://localhost/server-production',
    storage: rootPath + 'data/server-production'
  }
};

module.exports = config[env];
