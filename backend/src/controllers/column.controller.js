import ColumnService from '../services/column.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';

const ColumnController = {

  async create(req, res) {
    try {
      const data = await ColumnService.createColumn(req.body, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async getAll(req, res) {
    try {
      const data = await ColumnService.getColumns(req.query.project_id, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const data = await ColumnService.updateColumn(req.params.id, req.body.name, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      await ColumnService.deleteColumn(req.params.id, req.user.id);
      return successResponse(res, null, 'Deleted');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async reorder(req, res) {
    try {
      const { project_id, columns } = req.body;
      const data =await ColumnService.reorderColumns(project_id, columns, req.user.id);
      return successResponse(res, data, 'Reordered');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
};

export default ColumnController;