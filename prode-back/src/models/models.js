import { sequelize } from "../config/database.js";
import { Group } from "./group.model.js";
import { GroupMember } from "./groupMember.model.js";
import { GroupTournament } from "./groupTournament.model.js";
import { Match } from "./match.model.js";
import { Prediction } from "./prediction.model.js";
import { Subdivision } from "./subdivision.model.js";
import { Team } from "./team.model.js";
import { Tournament } from "./tournament.model.js";
import { TournamentSubdivision } from "./tournamentSubdivision.model.js";
import { User } from "./user.model.js";
import { UserMatchPoint } from "./userMatchPoint.model.js";
// await sequelize.sync({ alter: true });

User.hasMany(Prediction,   { foreignKey: 'user_id' });
Prediction.belongsTo(User, { foreignKey: 'user_id' });

// Match ⇄ Prediction (1:N)
Match.hasMany(Prediction,    { foreignKey: 'match_id' });
Prediction.belongsTo(Match,  { foreignKey: 'match_id' });

// Tournament ⇄ Match (1:N)
Tournament.hasMany(Match,   { foreignKey: 'tournament_id' });
Match.belongsTo(Tournament, { foreignKey: 'tournament_id' });

// Subdivision ⇄ Match (1:N)
Subdivision.hasMany(Match,     { foreignKey: 'subdivision_id' });
Match.belongsTo(Subdivision,   { foreignKey: 'subdivision_id' });

// Tournament ⇄ Subdivision (N:M via tournament_subdivisions)
Tournament.belongsToMany(Subdivision, {
  through: TournamentSubdivision,
  foreignKey: 'tournament_id',
  otherKey: 'subdivision_id'
});
Subdivision.belongsToMany(Tournament, {
  through: TournamentSubdivision,
  foreignKey: 'subdivision_id',
  otherKey: 'tournament_id'
});

// Tournament ⇄ Team (1:N)
Tournament.hasMany(Team,   { foreignKey: 'tournament_id' });
Team.belongsTo(Tournament, { foreignKey: 'tournament_id' });

// Team ⇄ Match (1:N) para local/visitante
Team.hasMany(Match,         { as: 'HomeMatches', foreignKey: 'home_team_id' });
Team.hasMany(Match,         { as: 'AwayMatches', foreignKey: 'away_team_id' });
Match.belongsTo(Team,       { as: 'homeTeam', foreignKey: 'home_team_id' });
Match.belongsTo(Team,       { as: 'awayTeam', foreignKey: 'away_team_id' });

// Group ⇄ User (N:M via group_members)
Group.belongsToMany(User,   { through: GroupMember, foreignKey: 'group_id', otherKey: 'user_id' });
User.belongsToMany(Group,   { through: GroupMember, foreignKey: 'user_id', otherKey: 'group_id' });

// Group ⇄ Tournament (1:N)
// Tournament.hasMany(Group,   { foreignKey: 'tournament_id' });
// Group.belongsTo(Tournament, { foreignKey: 'tournament_id' });
// Group ⇄ Tournament (N:M vía group_tournaments)
Group.belongsToMany(Tournament, {
  through: GroupTournament,
  foreignKey: 'group_id',
  otherKey: 'tournament_id'
});
Tournament.belongsToMany(Group, {
  through: GroupTournament,
  foreignKey: 'tournament_id',
  otherKey: 'group_id'
});
// User (creator) ⇄ Group (1:N)
User.hasMany(Group,         { as: 'CreatedGroups', foreignKey: 'created_by' });
Group.belongsTo(User,       { as: 'creator', foreignKey: 'created_by' });

User.hasMany(UserMatchPoint, { foreignKey: 'user_id' });
UserMatchPoint.belongsTo(User, { foreignKey: 'user_id' });

// Group ⇄ User (N:M via group_members)
Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: 'group_id',
  otherKey: 'user_id'
});
User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: 'user_id',
  otherKey: 'group_id'
});

// También podés definir explícitamente:
GroupMember.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(GroupMember, { foreignKey: 'user_id' });




import { Notification } from "./notification.model.js";

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

export {
  sequelize,
  User,
  Tournament,
  Subdivision,
  Team,
  Match,
  Prediction,
  Group,
  GroupMember,
  TournamentSubdivision,
  GroupTournament,
  UserMatchPoint,
  Notification
};