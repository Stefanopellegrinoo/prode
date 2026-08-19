import SubdivisionService from '../services/subdivision.service.js';

export default class SubdivisionController {
  constructor() {
    this.service = new SubdivisionService();
  }

  getAll = async (req, res, next) => {
    try {
      const data = await this.service.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  create = async (req, res, next) => {
    try {
      const dto = { name: req.body.name };
      const created = await this.service.create(dto);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dto = { name: req.body.name };
      const updated = await this.service.update(id, dto);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
