import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import pg from 'pg'

import dotenv from 'dotenv';
dotenv.config();

const {
  DATABASE_URL,
  DB_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_POOL_MAX = 20,
  DB_POOL_MIN = 5,
  DB_POOL_ACQUIRE = 30000,
  DB_POOL_IDLE = 10000,
  DB_SSL = 'false',
  NODE_ENV
} = process.env;

const connectionUri = DATABASE_URL || DB_URL;

const sequelizeOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  pool: {
    max: parseInt(DB_POOL_MAX, 10),
    min: parseInt(DB_POOL_MIN, 10),
    acquire: parseInt(DB_POOL_ACQUIRE, 10),
    idle: parseInt(DB_POOL_IDLE, 10),
  },
  logging: NODE_ENV === 'production' ? false : (msg) => console.debug(msg),
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
  dialectOptions: DB_SSL === 'true'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
};

export const sequelize = connectionUri
  ? new Sequelize(connectionUri, sequelizeOptions)
  : new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      ...sequelizeOptions,
      host: DB_HOST,
      port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
    });
