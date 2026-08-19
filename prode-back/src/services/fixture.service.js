// src/services/fixture.service.js
import { fixtures } from "../models/fixture.model.js";
import { Fixture } from "../models/fixture.model.js";
import { Match } from "../models/match.model.js";
import { tournaments } from "../models/tournament.model.js";
import { teams } from "../models/team.model.js";
import { subdivisions } from "../models/subdivision.model.js";
import { predictions } from "../models/prediction.model.js";


export class FixtureService {
  // Método para agregar un partido manualmente al fixture de un torneo,
  // generando el partido para cada subdivisión permitida del torneo.
  async addMatchToFixture(tournamentId, matchData) {
    const tid = Number(tournamentId);
    
    // Verificar que el torneo exista
    const tournament = tournaments.find(t => t.id === tid);
    if (!tournament) {
      throw new Error("Torneo no encontrado.");
    }

    // Buscar el fixture existente, o crearlo si no existe
    let fixture = fixtures.find(f => f.tournamentId === tid);
    if (!fixture) {
      fixture = new Fixture(fixtures.length + 1, tid, []);
      fixtures.push(fixture);
    }
    console.log(tournament, matchData)
    // Por cada subdivisión permitida en el torneo (por ejemplo, tournament.allowedSubdivisionIds === [1,2,3])
    tournament.allowedSubdivisionIds.forEach((subdivisionId) => {
      // Calcular un matchId único para este partido en esta subdivisión.
      // Aquí usamos la cantidad de partidos ya existentes para esa subdivisión en el fixture
      const countInSubdivision = fixture.matches.filter(
        m => m.subdivisionId === Number(subdivisionId)
      ).length;
      const newMatchId = `${tid}-${subdivisionId}-${countInSubdivision + 1}`;

      // Crear el partido para esta subdivisión usando los datos ingresados
      const newMatch = new Match(
        newMatchId,
        Number(matchData.homeTeamId),
        Number(matchData.awayTeamId),
        matchData.date || "",
        Number(subdivisionId),
        matchData.homeScore !== undefined ? Number(matchData.homeScore) : null,
        matchData.awayScore !== undefined ? Number(matchData.awayScore) : null,
        matchData.round
      );
      console.log(subdivisionId, newMatch)
      // Agregar el partido al array de matches del fixture
      fixture.matches.push(newMatch);
    });

    return fixture;
  }

  // Obtener el fixture completo de un torneo
  async getFixtureByTournament(tournamentId) {
    return fixtures.find(f => f.tournamentId === Number(tournamentId));
  }

  async getGroupedFixtureByTournament(tournamentId) {
    const tid = Number(tournamentId);
    const fixture = await this.getFixtureByTournament(tid);
    if (!fixture) {
      throw new Error("Fixture no encontrado.");
    }
    // Inicializamos el objeto de agrupamiento.
    const grouped = {};

    // Para cada partido en el fixture...
    fixture.matches.forEach(match => {
      // Buscamos la subdivisión correspondiente.
      const sub = subdivisions.find(s => s.id === match.subdivisionId);
      const subName = sub ? sub.name : "Sin Subdivisión";

      // Inicializamos la subdivisión en grouped si no existe
      if (!grouped[subName]) grouped[subName] = {};

      // Usamos la fecha del partido (podrías formatearla según rounds, por ejemplo "Fecha 1", etc.)
      // En este ejemplo, si match.date existe, se utiliza tal cual; de lo contrario, se asigna "Sin Fecha"
      const roundKey = match.date ? match.date : "Sin Fecha";

      if (!grouped[subName][roundKey]) {
        grouped[subName][roundKey] = [];
      }
      grouped[subName][roundKey].push(match);
    });

    // Obtenemos el nombre del torneo
    const tournamentData = tournaments.find(t => t.id === tid);
    const tournamentName = tournamentData ? tournamentData.name : "Torneo Desconocido";

    // Devolvemos la data agrupada en el formato deseado
    return {
      [tournamentName]: grouped
    };
  }

  // Métodos opcionales para actualizar o eliminar un match individual...
  async updateMatch(matchId, data) {
    let foundMatch = null;
    fixtures.forEach(fixture => {
      const m = fixture.matches.find(match => match.id === matchId);
      if (m) foundMatch = m;
    });
    if (!foundMatch) throw new Error("Match no encontrado.");
    if (data.teamAId) foundMatch.teamAId = Number(data.teamAId);
    if (data.teamBId) foundMatch.teamBId = Number(data.teamBId);
    if (data.date) foundMatch.date = data.date;
    if (data.subdivisionId) foundMatch.subdivisionId = Number(data.subdivisionId);
    if (data.homeScore !== undefined) foundMatch.homeScore = Number(data.homeScore);
    if (data.awayScore !== undefined) foundMatch.awayScore = Number(data.awayScore);
    return foundMatch;
  }

  async deleteMatch(matchId) {
    for (let fixture of fixtures) {
      const index = fixture.matches.findIndex(match => match.id === matchId);
      if (index !== -1) {
        fixture.matches.splice(index, 1);
        return { message: "Match eliminado correctamente." };
      }
    }
    throw new Error("Match no encontrado.");
  }
  async getEnrichedFixtureByTournamentAndUser(tournamentId, userId) {
    // Obtener el fixture del torneo
    const fixture = await this.getFixtureByTournament(tournamentId);
    if (!fixture) {
      throw new Error("Fixture no encontrado");
    }
  
    // Filtrar las predicciones del usuario
    const userPredictions = predictions.filter(p => p.userId === userId);
   console.log("userPredictions", userId)

    // Crear un mapa: clave -> matchId, valor -> predicción
    const predictionMap = userPredictions.reduce((acc, pred) => {
      acc[pred.matchId] = pred;
      return acc;
    }, {});
    // console.log("predictionMap", predictionMap)
  
    // Enriquecer cada partido agregándole la predicción (si existe)
    const enrichedMatches = fixture.matches.map(match => ({
      ...match,
      userPrediction: predictionMap[match.id] || null,
    }));
    // console.log("enrichedMatches", enrichedMatches )
  
    // Retornar el fixture enriquecido con los partidos actualizados
    return { ...fixture, matches: enrichedMatches };
  }
  
  async getGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId) {
    const tid = Number(tournamentId);
    // Obtenemos el fixture enriquecido (cada match tiene userPrediction)
    const enrichedFixture = await this.getEnrichedFixtureByTournamentAndUser(tid, userId);
    if (!enrichedFixture) {
      throw new Error("Fixture no encontrado.");
    }
  
    // Inicializamos el objeto de agrupamiento
    const grouped = {};
  
    // Recorremos cada partido enriquecido
    enrichedFixture.matches.forEach(match => {
      // Buscamos la subdivisión del partido
      const sub = subdivisions.find(s => s.id === match.subdivisionId);
      const subName = sub ? sub.name : "Sin Subdivisión";
  
      // Inicializamos el objeto para esa subdivisión si no existe
      if (!grouped[subName]) grouped[subName] = {};
  
      // La clave del round la usamos a partir de la fecha del partido (o "Sin Fecha")
      const roundKey = match.date ? match.date : "Sin Fecha";
  
      if (!grouped[subName][roundKey]) {
        grouped[subName][roundKey] = [];
      }
      grouped[subName][roundKey].push(match);
    });
  
    // Obtenemos el nombre del torneo
    const tournamentData = tournaments.find(t => t.id === tid);
    const tournamentName = tournamentData ? tournamentData.name : "Torneo Desconocido";
  
    // Retornamos en el mismo formato que el admin:
    return {
      [tournamentName]: grouped
    };
  }
  
  // Por ejemplo, en FixtureService:
async recalculatePointsForMatch(match) {
  // Se buscan todas las predicciones para ese partido
  const matchPredictions = predictions.filter(p => p.matchId === match.id);
  
  // Se recorre cada predicción y se recalcula el puntaje
  matchPredictions.forEach(prediction => {
    prediction.points = calculatePoints(prediction, match);
    prediction.updatedAt = new Date().toISOString();
  });
}

  
}

