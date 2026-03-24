import WorkspaceService from '../services/workspace.service.js';
import { successResponse } from '../Utils/response.js';

const WorkspaceController = {

  async create(req, res, next) {
    try {
      const data = await WorkspaceService.createWorkspace(
        req.body,
        req.user.id
      );

      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await WorkspaceService.getUserWorkspaces(
        req.user.id
      );

      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await WorkspaceService.getWorkspaceById(
        req.params.id,
        req.user.id
      );

      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  // 🔥 THÊM ĐOẠN NÀY
  async addMember(req, res, next) {
    try {
      const workspaceId = req.params.id;
      const { user_id, role } = req.body;

      const data = await WorkspaceService.addMember(
        workspaceId,
        user_id,
        role,
        req.user.id
      );

      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

};

export default WorkspaceController;