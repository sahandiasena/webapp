var config = require('../../config/config');
var querystring = require("querystring");
var authy = require('authy')(config.authyApiKey);

exports.sendApprovalRequest = function (id, details, callback) {
  var url = "/onetouch/json/users/" + querystring.escape(id) + "/approval_requests";
  authy._request("post", "/onetouch/json/users/" + querystring.escape(id) + "/approval_requests", {
    "details[Email Address]": details.email,
    "message": details.message
  }, callback);
};
