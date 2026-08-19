import { Subdivision } from '../models/subdivision.model.js'; // Asegúrate de importar el modelo correcto

export default class SubdivisionRepository {
  async findAll() {
    return Subdivision.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id) {
    return Subdivision.findByPk(id);
  }

  async create(data) {
    return Subdivision.create(data);
  }

  async update(id, data) {
    const subdiv = await Subdivision.findByPk(id);
    if (!subdiv) throw new Error('Subdivisión no encontrada');
    return subdiv.update(data);
  }

  async delete(id) {
    const subdiv = await Subdivision.findByPk(id);
    if (!subdiv) throw new Error('Subdivisión no encontrada');
    await subdiv.destroy();
  }
}
