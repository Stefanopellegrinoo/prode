// src/services/groupDetails.service.js

import { Group } from "../models/group.model.js";
import { Tournament } from "../models/tournament.model.js";
import { Subdivision } from "../models/subdivision.model.js";
import RankingRepository from "../repositories/ranking.repository.js";
import { User } from "../models/user.model.js";
import { redis } from "../config/redis.js";
import { GroupMember } from "../models/groupMember.model.js";

export default class GroupDetailsService {
  constructor() {
    this.rankingRepository = new RankingRepository();
  }

  async groupMembers(groupId) {
    const members = await GroupMember.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          attributes: ['id', 'name',"username"]
        }
      ]
    });
  
    return members

  }

  async getGroupDetails(id) {
   
    // const cacheKey = `ranking:group:${id}`;
    // // 1. Verificamos si ya está en Redis
    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }
    const group = await Group.findByPk(id, {
      attributes: ["id", "name", "description", "inviteCode"],
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "username"] },
        {
          model: Tournament,
          attributes: ["id", "name", "season"],
          through: { attributes: [] },
          include: [
            {
              model: Subdivision,
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!group) {
      throw new Error("Grupo no encontrado");
    }

    const result = {
      groupId: group.id,
      groupName: group.name,
      groupDescription: group.description,
      inviteCode: group.inviteCode,
      creator: group.creator,
      tournaments: [],
    };
    const members = await this.groupMembers(group.id);
  
    for (const tournament of group.Tournaments) {
      const tournamentData = {
        id: tournament.id,
        name: tournament.name,
        season: tournament.season,
        subdivisions: [],
      };

      for (const subdivision of tournament.Subdivisions) {
        const ranking = await this.rankingRepository.getGroupRanking(
          group.id,
          tournament.id,
          subdivision.id,
          members
        );

        tournamentData.subdivisions.push({
          id: subdivision.id,
          name: subdivision.name,
          ranking,
        });
      }

      result.tournaments.push(tournamentData);
    }
    // 3. Guardamos en Redis por 5 minutos
    // await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

    return result;
  }
}
