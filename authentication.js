var jwt = require('jsonwebtoken');
var crypto = require('crypto');

function create_signature(original, secret_key) {
  return crypto
    .createHmac('sha256', secret_key)
    .update(secret_key, original)
    .digest('base64');
}

function create_signed_request(request_method, request_path, secret) {
  return create_signature(
    request_method + " " + request_path,
    secret
  );
}

function create_jwt_token(request_method, request_path, secret, client_id, request_body) {

  console.log("\n\narguments\n  ", request_method, request_path, secret, client_id, request_body);

  var signed_url = create_signed_request(
        request_method, request_path, secret
      ),
      headers = {
        typ: "JWT",
        alg: "HS256"
      },
      claims = {
        iss: client_id,
        iat: Math.round(Date.now() / 1000),
        req: signed_url
      };

  console.info('\nsigned_url\n  ', signed_url);

  if (request_body) {
    claims.pay = create_signature(request_body, secret);
    console.info('\nclaims.pay\n  ', claims.pay);
  }

  return jwt.sign(claims, secret, {headers: headers});

}

var token = (
  create_jwt_token("POST", "/notifications/sms", "SECRET", 123, "{'content': 'Hello world'}")
);

console.log("\n" + "=".repeat(80));
console.info("\ntoken\n  ", token);
console.info("\njwt.decode(token)\n", jwt.decode(token));

module.exports = create_jwt_token;
