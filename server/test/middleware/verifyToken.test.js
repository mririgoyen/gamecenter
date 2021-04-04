const logMock = require('../../../test/__mocks__/logMock');

describe('server > middleware > verifyToken', () => {
  jest.mock('google-auth-library', () => ({
    auth: {
      fromAPIKey: () => ({
        verifyIdToken: async ({ idToken }) => {
          if (idToken === 'notvalid') {
            throw new Error('NotValid');
          }

          return {
            payload: {
              email: 'testing@irigoyen.dev',
              sub: 'abcd1234'
            }
          };
        }
      })
    }
  }));

  const verifyTokenMiddleware = require('../../middleware/verifyToken');

  it('returns a 403 Forbidden if the Authorization token is not valid', async () => {
    const reqMock = {
      headers: {
        authorization: 'Bearer notvalid'
      },
      log: logMock
    };
    const resMock = {
      json: (code, body) => {
        expect(code).toBe(403);
        expect(body.errorCode).toBe('Forbidden');
      }
    };

    await verifyTokenMiddleware(reqMock, resMock);
  });

  it('injects an "auth" object on the request and calls next() if the token is valid', async () => {
    const reqMock = {
      headers: {
        authorization: 'Bearer valid'
      },
    };
    const next = jest.fn();

    await verifyTokenMiddleware(reqMock, null, next);
    expect(reqMock.auth.key).toBe('abcd1234');
    expect(reqMock.auth.userEmail).toBe('testing@irigoyen.dev');
    expect(next).toHaveBeenCalled();
  });
});
