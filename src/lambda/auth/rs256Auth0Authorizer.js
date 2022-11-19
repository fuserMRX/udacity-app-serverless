import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
// import { JwksClient } from '../../auth/JwksClient';
const jwks = require("jwks-rsa");

// We can programmatically fetch it from Auth0 when we validate a token,
// but to keep the exercise more straightforward we will just copy it
// for now and store as a string in a function's source code.
// const cert = `-----BEGIN CERTIFICATE-----
// from auth0 site!!!
// -----END CERTIFICATE-----`;

const jwksUrl = "https://dev-imwin-7q.us.auth0.com/.well-known/jwks.json";

export const handler = async (event) => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    console.log("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    console.log("User authorized", e.message);

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

const verifyToken = async (authHeader) => {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  const jwt = decode(token, { complete: true });
  const { header } = jwt;
  const { kid } = header;
  console.log("jwt =============>", jwt);
  console.log("kid =============>", kid);

  const client = jwks({
    jwksUri: jwksUrl, //this is the API endpoint; responds with a json key
  });

  const key = await client.getSigningKey(kid);
  console.log("getSigningKey =========> ", key);
  const signingKey = key.getPublicKey();
  console.log("getPublicKey =========> ", signingKey);

  return verify(token, signingKey, { algorithms: ["RS256"] });
  // alt method with certificate
  // return verify(token, cert, { algorithms: ['RS256'] });
};
