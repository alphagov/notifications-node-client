var jwt = require('jsonwebtoken');
var crypto = require('crypto');


function create_signature(original, secret_key) {
  return crypto
    .createHmac('sha256', secret_key)
    .update(original)
    .digest('base64');
}

function create_govuk_notify_token(request_method, request_path, secret, client_id, request_body) {

  var claims = {
    iss: client_id,
    iat: Math.round(Date.now() / 1000),
    req: create_signature(request_method + " " + request_path, secret)
  };

  if (request_body) claims.pay = create_signature(request_body, secret);

  return jwt.sign(claims, secret, {headers: {typ: "JWT", alg: "HS256"}});

}

module.exports = create_govuk_notify_token;
