var jose = require('jose')


function createGovukNotifyToken(request_method, request_path, secret, client_id) {
  return new jose.SignJWT()
    .setIssuer(client_id)
    .setIssuedAt()
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(new TextEncoder().encode(secret));
}

module.exports = createGovukNotifyToken;
