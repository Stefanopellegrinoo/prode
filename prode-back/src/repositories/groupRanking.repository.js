import { User } from '../models/user.model.js';
import { Group } from '../models/group.model.js';
import { GroupMember } from '../models/groupMember.model.js';
import { UserMatchPoint } from '../models/userMatchPoint.model.js';
import { Sequelize } from 'sequelize';

export default class GroupRankingRepository {
  async getRankingByGroup(groupId) {
    const members = await GroupMember.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username']
        }
      ]
    });

    if (!members || members.length === 0) {
      return [];
    }

    const userIds = members.map(m => m.userId || m.user_id);

    const points = await UserMatchPoint.findAll({
      where: { user_id: userIds },
      attributes: [
        'user_id',
        [Sequelize.fn('SUM', Sequelize.col('points')), 'totalPoints']
      ],
      group: ['user_id'],
      raw: true
    });

    const merged = members.map(member => {
      const uId = member.userId || member.user_id;
      const userPoints = points.find(p => p.user_id === uId);
      const userObj = member.User || member.user || {};
      return {
        userId: uId,
        name: userObj.name || '',
        userName: userObj.username || '',
        points: userPoints ? parseInt(userPoints.totalPoints, 10) : 0
      };
    });

    return merged.sort((a, b) => b.points - a.points);
  }
}
