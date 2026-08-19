import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import RankingController from '../src/controller/ranking.controller.js';

describe('RankingController - Parameter Order (ranking.test.js)', () => {
  it('getSubdivisionRanking debe pasar tournamentId y subdivisionId en el orden correcto al servicio', async () => {
    const controller = new RankingController();

    let passedTournamentId = null;
    let passedSubdivisionId = null;

    controller.rankingService = {
      getSubdivisionRanking: async (tournId, subId) => {
        passedTournamentId = tournId;
        passedSubdivisionId = subId;
        return [{ user_id: 1, points: 15 }];
      },
    };

    const req = {
      params: {
        subdivisionId: '2',
        tournamentId: '1',
      },
    };

    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
      },
    };

    await controller.getSubdivisionRanking(req, res, () => {});

    assert.equal(passedTournamentId, 1);
    assert.equal(passedSubdivisionId, 2);
    assert.equal(responseData.length, 1);
    assert.equal(responseData[0].points, 15);
  });
});
