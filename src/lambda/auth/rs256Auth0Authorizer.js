
import 'source-map-support/register';

import { verify } from 'jsonwebtoken';

// We can programmatically fetch it from Auth0 when we validate a token,
// but to keep the exercise more straightforward we will just copy it 
// for now and store as a string in a function's source code.
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJbz50paMdeRjAMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1pbXdpbi03cS51cy5hdXRoMC5jb20wHhcNMjIxMDE3MDgyMTI5WhcN
MzYwNjI1MDgyMTI5WjAkMSIwIAYDVQQDExlkZXYtaW13aW4tN3EudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA80bUni8fGUSxG413
5bZjTrQJGCAM9vPHqY0u8jsuwCOIPaNSux6km47vq6ap16kGZRZMgkgY7VueQo4g
GwZaMzh7y7/qKJfA/sKvqHPFdMh6GS4vI577UYVs4bxyhA+BzSc46w1ttfMCOAYZ
6QvxZQNDiQOgCPyHvY5gsTI4WslIpg6fpiiqKq017Sew1MugMbrdjydf+2U0MVlA
6Y7C90Sm2qJtapTLdT4C5xvLXTEJ5dyqHVeLDeuvwo/2yUTa76MWk1XiAQM7xm12
TkWpTKqQ8RpevI93ZApqit4sMezoY7P8W4I87Qd0HW2U/PrEU8/J17bGeYbRrk/5
syOUjQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRvaUD36tR+
XQX1tDPs2W97rM7AaTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ACmH3yaPI3TsRdrMkg3EBzIfpsH3F0ptHAfC37360vQlQCbv5rolAbkoFBudXdx4
bLcAVMzcyNdwqBh3KOdrOT+kr98coUJwlOf8nOw3rAEkoFxyOuHplv7V9upowHsA
nAqJq0piDrrM6QD0qVX8BMm+ZXPG0geHVVKOunXVdU5EF/qy5lhi/ZH8zYDRCX6Q
sKJDOnfH/1Lp+eCVgWnb3hahoB4hNcmA+AVLfvWZKBMgRSjEsRSYRowi6JotcglB
KnS4ayTZJutl659OsXpBH25T+Jx97aJ8go7JBOyq48LrHj5R15Hs6sodTbh4irNc
0+anB5fMvHRg3QXnD2QTmu8=
-----END CERTIFICATE-----`;

export const handler = async (event) => {
  try {
    const jwtToken = verifyToken(event.authorizationToken);
    console.log('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
};

function verifyToken(authHeader) {
  if (!authHeader)
    throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return verify(token, cert, { algorithms: ['RS256'] });
}
