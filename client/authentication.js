var jwt = require('jsonwebtoken');
var crypto = require('crypto');


function createGovukNotifyToken(request_method, request_path, secret, client_id, request_body) {

  return jwt.sign(
    {
      iss: client_id,
      iat: Math.round(Date.now() / 1000)
    },
    secret,
    {
      headers: {typ: "JWT", alg: "HS256"}
    }
  );
}

module.exports = createGovukNotifyToken;
