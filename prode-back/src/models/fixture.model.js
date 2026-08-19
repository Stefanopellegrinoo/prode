// src/models/fixture.model.js
export class Fixture {
  constructor(id, tournamentId, matches = []) {
    this.id = id;               // Identificador único del fixture
    this.tournamentId = tournamentId; // ID del torneo al que corresponde el fixture
    this.matches = matches;     // Array de objetos Match
  }
}

// Simulación en memoria de fixtures
export const fixtures = [];
