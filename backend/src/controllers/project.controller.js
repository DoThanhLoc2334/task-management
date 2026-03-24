import ProjectService from '../services/project.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';

const ProjectController = {

  async create(req, res) {
    try {
      const data = await ProjectService.createProject(req.body, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'MISSING_FIELDS') {
        return errorResponse(res, 'Missing fields', 400);
      }
      if (err.message === 'NO_PERMISSION') {
        return errorResponse(res, 'No permission', 403);
      }
      return errorResponse(res, err.message);
    }
  },

  async getAll(req, res) {
    try {
      const data = await ProjectService.getProjects(req.query.workspace_id, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async getById(req, res) {
    try {
      const data = await ProjectService.getProjectById(req.params.id, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'PROJECT_NOT_FOUND') {
        return errorResponse(res, 'Project not found', 404);
      }
      return errorResponse(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const data = await ProjectService.updateProject(req.params.id, req.body, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'NO_PERMISSION') {
        return errorResponse(res, 'No permission', 403);
      }
      return errorResponse(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      await ProjectService.deleteProject(req.params.id, req.user.id);
      return successResponse(res, null, 'Deleted successfully');
    } catch (err) {
      if (err.message === 'NO_PERMISSION') {
        return errorResponse(res, 'No permission', 403);
      }
      return errorResponse(res, err.message);
    }
  }
};

export default ProjectController;