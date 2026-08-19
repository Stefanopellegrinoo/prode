// src/controllers/tournament.controller.js
import TournamentService from '../services/tournament.service.js';

export default class TournamentController {
  constructor() {
    this.service = new TournamentService();
  }

  async create(req, res, next) {
    try {
      const tournament = await this.service.create(req.body);
      res.status(201).json(tournament);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const tournament = await this.service.update(req.params.id, req.body);
      res.json(tournament);
    } catch (err) {
      next(err);
    }
  }

  async findAll(req, res, next) {
    try {
      const list = await this.service.findAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    try {
      const t = await this.service.findById(req.params.id);
      if (!t) return res.status(404).json({ message: 'No existe ese torneo' });
      res.json(t);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
