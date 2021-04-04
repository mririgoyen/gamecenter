describe('server > middleware > admin', () => {
  const adminMiddleware = require('../../middleware/admin');

  beforeAll(() => {
    process.env.ADMIN_API_KEY = 'TESTING_KEY';
  });

  afterAll(() => {
    delete process.env.ADMIN_API_KEY;
  });

  it('returns a 401 Unauthorized if no admin key is not provided', () => {
    const reqMock = {
      headers: {},
      log: { error: () => {} }
    };
    const resMock = {
      json: (code, body) => {
        expect(code).toBe(401);
        expect(body.errorCode).toBe('Unauthorized');
      }
    };

    adminMiddleware(reqMock, resMock);
  });

  it('returns a 401 Unauthorized if a valid admin key is not provided', () => {
    const reqMock = {
      headers: {
        'x-admin-key': 'NOT_VALID'
      },
      log: { error: () => {} }
    };
    const resMock = {
      json: (code, body) => {
        expect(code).toBe(401);
        expect(body.errorCode).toBe('Unauthorized');
      }
    };

    adminMiddleware(reqMock, resMock);
  });

  it('calls next() if a valid admin key is provided', () => {
    const reqMock = {
      headers: {
        'x-admin-key': 'TESTING_KEY'
      }
    };
    const next = jest.fn();

    adminMiddleware(reqMock, null, next);
    expect(next).toHaveBeenCalled();
  });
});
