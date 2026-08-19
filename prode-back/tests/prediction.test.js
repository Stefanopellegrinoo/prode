import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import PredictionController from '../src/controller/prediction.controller.js';

describe('PredictionController - IDOR & Methods (prediction.test.js)', () => {
  it('save debe forzar el userId autenticado de req.user e ignorar req.body.userId', async () => {
    const controller = new PredictionController();

    let passedData = null;
    controller.predictionService = {
      savePrediction: async (data) => {
        passedData = data;
        return { id: 1, ...data };
      },
    };

    const req = {
      user: { id: 42, role: 'user' },
      body: {
        userId: 999, // Intento de spoofing / IDOR
        matchId: 10,
        predicted_winner: 'home',
      },
    };

    let responseData = null;
    let statusCode = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await controller.save(req, res, () => {});

    assert.equal(statusCode, 200);
    assert.equal(passedData.userId, 42); // Forzado desde req.user.id
    assert.equal(passedData.matchId, 10);
    assert.equal(passedData.predicted_winner, 'home');
    assert.equal(responseData.userId, 42);
  });

  it('getByUser debe llamar a getPredictionsForUser con el userId del token', async () => {
    const controller = new PredictionController();

    let queriedUserId = null;
    controller.predictionService = {
      getPredictionsForUser: async (userId) => {
        queriedUserId = userId;
        return [{ id: 1, matchId: 5, predicted_winner: 'away' }];
      },
    };

    const req = { user: { id: 42 } };
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
      },
    };

    await controller.getByUser(req, res, () => {});

    assert.equal(queriedUserId, 42);
    assert.equal(responseData.length, 1);
    assert.equal(responseData[0].predicted_winner, 'away');
  });
});
