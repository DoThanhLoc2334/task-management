import WorkspaceService from '../services/workspace.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';

const WorkspaceController = {

  async create(req, res) {
    try {
      const data = await WorkspaceService.createWorkspace(req.body, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'MISSING_NAME') {
        return errorResponse(res, 'Name is required', 400);
      }
      return errorResponse(res, err.message);
    }
  },

  async getAll(req, res) {
    try {
      const data = await WorkspaceService.getUserWorkspaces(req.user.id);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  },

  async getById(req, res) {
    try {
      const data = await WorkspaceService.getWorkspaceById(req.params.id, req.user.id);
      return successResponse(res, data);
    } catch (err) {
      if (err.message === 'WORKSPACE_NOT_FOUND') {
        return errorResponse(res, 'Workspace not found', 404);
      }
      if (err.message === 'FORBIDDEN') {
        return errorResponse(res, 'Forbidden', 403);
      }
      return errorResponse(res, err.message);
    }
  }
};

export default WorkspaceController;