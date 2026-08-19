// src/services/subdivision.service.js
import SubdivisionRepository from '../repositories/subdivision.repository.js';

export default class SubdivisionService {
  constructor() {
    this.repo = new SubdivisionRepository();
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id) {
    const subdiv = await this.repo.findById(id);
    if (!subdiv) throw new Error('Subdivisión no encontrada');
    return subdiv;
  }

  async create(dto) {
    // dto = { name }
    return this.repo.create(dto);
  }

  async update(id, dto) {
    return this.repo.update(id, dto);
  }

  async delete(id) {
    await this.repo.delete(id);
    return { message: 'Subdivisión eliminada correctamente' };
  }
}
