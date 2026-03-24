import db from '../config/db.js';
import WorkspaceRepository from '../models/workspace.repository.js';
import { errorResponse } from '../Utils/response.js';

const permissionMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      // 🔥 lấy workspace từ task
      const result = await db.query(
        `
        SELECT p.workspace_id
        FROM tasks t
        JOIN columns c ON t.column_id = c.id
        JOIN projects p ON c.project_id = p.id
        WHERE t.id = $1
        `,
        [taskId]
      );

      if (!result.rows.length) {
        return errorResponse(res, 'Task not found', 404);
      }

      const workspace_id = result.rows[0].workspace_id;

      // 🔥 check membership
      const member = await WorkspaceRepository.getUserRole(
        workspace_id,
        userId
      );

      if (!member) {
        return errorResponse(res, 'Forbidden', 403);
      }

      // 🔥 check role
      if (requiredRoles.length && !requiredRoles.includes(member.role)) {
        return errorResponse(res, 'Permission denied', 403);
      }

      // gắn thêm cho service nếu cần
      req.workspace_id = workspace_id;
      req.user_role = member.role;

      next();
    } catch (err) {
      return errorResponse(res, err.message);
    }
  };
};

export default permissionMiddleware;