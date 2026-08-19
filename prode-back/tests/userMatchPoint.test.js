import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import UserMatchPointController from '../src/controller/userMatchPoint.controller.js';

describe('UserMatchPointController - assignPoints (userMatchPoint.test.js)', () => {
  it('debe rechazar con 400 si falta matchId en el body', async () => {
    const controller = new UserMatchPointController();
    const req = { body: {} };
    let statusCode = null;
    let jsonResponse = null;

    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };

    await controller.assignPoints(req, res, () => {});

    assert.equal(statusCode, 400);
    assert.match(jsonResponse.message, /matchId es requerido/);
  });

  it('debe calcular puntos si el partido existe', async () => {
    const controller = new UserMatchPointController();
    const mockMatch = { id: 10, tournament_id: 1, subdivision_id: 2, result: 'home' };

    controller.matchRepository = {
      findById: async (id) => {
        return id === 10 ? mockMatch : null;
      },
    };

    let calculatedMatch = null;
    controller.service = {
      calculateAndStorePoints: async (match) => {
        calculatedMatch = match;
      },
    };

    const req = { body: { matchId: 10 } };
    let jsonResponse = null;
    const res = {
      json: (data) => {
        jsonResponse = data;
      },
    };

    await controller.assignPoints(req, res, () => {});

    assert.equal(calculatedMatch.id, 10);
    assert.match(jsonResponse.message, /Puntos calculados/);
  });
});
