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
  },

  async changeRole(req, res, next) {
    try {
      const workspaceId = req.params.id;       // /:id
      const targetUserId = req.params.userId;  // /members/:userId
      const { role } = req.body;
      console.log("Changing role:", { workspaceId, targetUserId, role });

      const data = await WorkspaceService.changeRole(
        workspaceId,
        targetUserId,
        role,
        req.user.id
      );

      return successResponse(res, data, 'Role updated');

    } catch (err) {
      next(err);
    }
  },
  async removeMember(req, res, next) {
    try {
      const workspaceId = req.params.id;
      const targetUserId = req.params.userId;

      const data = await WorkspaceService.removeMember(
        workspaceId,
        targetUserId,
        req.user.id
      );

      return successResponse(res, data, data.message);

    } catch (err) {
      next(err);
    }
  },
  
  async leaveWorkspace(req, res, next) {
    try {
      const workspaceId = req.params.id;

      const data = await WorkspaceService.leaveWorkspace(
        workspaceId,
        req.user.id
      );

      return successResponse(res, data, data.message);
    } catch (err) {
      next(err);
    }
  },
  async deleteWorkspace(req, res, next) {
    try {
      const workspaceId = req.params.id; 
      const data = await WorkspaceService.deleteWorkspace(
        workspaceId,
        req.user.id
      );
        return successResponse(res, data, data.message);
    } catch (err) {
      next(err);
      
    }
  }

};

export default WorkspaceController;