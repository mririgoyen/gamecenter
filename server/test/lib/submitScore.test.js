describe('server > lib > submitScore', () => {
  jest.mock('google-auth-library', () => ({
    auth: {
      fromAPIKey: () => ({
        verifyIdToken: async ({ idToken }) => {
          if (idToken === 'notvalid') {
            throw new Error('NotValid');
          }

          return {
            payload: {
              email: idToken === 'invalidUser' ? 'baduser@irigoyen.dev' : 'testing@irigoyen.dev',
              sub: 'abcd1234'
            }
          };
        }
      })
    }
  }));

  jest.mock('crypto-js', () => ({
    AES: {
      decrypt: (payload) => JSON.stringify(payload)
    },
    enc: {
      Utf8: 'utf8'
    }
  }));

  jest.mock('../../model/users/getUserRecordByEmailAddress', () => async (log, emailAddress) => {
    if (emailAddress === 'baduser@irigoyen.dev') {
      return;
    }
    return { userId: 'userId' };
  });

  jest.mock('../../model/scores/createGameScoreRecord');
  jest.mock('../../lib/slack');

  const submitScore = require('../../lib/submitScore');

  it('does not submit a score and logs an error if the Authorization token is not valid', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('NotValid');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'notvalid' });
  });

  it('does not submit a score and logs an error if no `emailAddress` is supplied', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { game: 'game', score: 100, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if an invalid `emailAddress` is supplied', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'notARealAddress', game: 'game', score: 100, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if the supplied `emailAddress` does not match the Authorization token', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'not@irigoyen.dev', game: 'game', score: 100, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if no `game` is supplied', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', score: 100, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if `game` is not a string', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', game: 1, score: 100, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if the `score` is not a valid number', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', game: 'game', score: 'score', scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if the `score` is not a valid integer', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', game: 'game', score: 3.14, scoreId: 'scoreId' } });
  });

  it('does not submit a score and logs an error if no `scoreId` is supplied', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid request body');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', game: 'game', score: 100 } });
  });

  it('does not submit a score and logs an error if the supplied `emailAddress` is not a valid user', async () => {
    const logMock = {
      error: (details, message) => {
        expect(details.error.message).toBe('Invalid user');
        expect(message).toBe('Unable to submit score');
      }
    };
    await submitScore(logMock, { authorization: 'invalidUser', packet: { emailAddress: 'baduser@irigoyen.dev', game: 'game', score: 100, scoreId: 'scoreId' } });
  });

  it('submits a score', async () => {
    await submitScore({}, { authorization: 'valid', packet: { emailAddress: 'testing@irigoyen.dev', game: 'game', score: 100, scoreId: 'scoreId' } });
  });
});