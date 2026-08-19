// src/models/matchResult.model.js
export default class MatchResult {
    constructor(id, fixtureId, subdivisionId, scoreTeamA, scoreTeamB) {
      this.id = id;
      this.fixtureId = fixtureId;       // Relaciona el resultado con un fixture
      this.subdivisionId = subdivisionId; // Relaciona el resultado con la subdivisión (ej. "Intermedia")
      this.scoreTeamA = scoreTeamA;     // Resultado del equipo A
      this.scoreTeamB = scoreTeamB;     // Resultado del equipo B
    }
  }
  
  // Simulación en memoria de resultados
  export const matchResults = [];
  