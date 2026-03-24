import db from '../config/db.js'; 

const workspaceAuth = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      // ❌ chưa login
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED'
        });
      }

      // 👉 lấy workspace_id từ nhiều nguồn
      const workspaceId =
        req.body.workspace_id ||
        req.params.workspace_id ||
        req.query.workspace_id;

      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: 'WORKSPACE_ID_REQUIRED'
        });
      }

      // 👉 check membership
      const result = await db.query(
        `
        SELECT role 
        FROM workspace_members
        WHERE workspace_id = $1 AND user_id = $2
        `,
        [workspaceId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'NOT_IN_WORKSPACE'
        });
      }

      const userRole = result.rows[0].role;

      // 👉 nếu có yêu cầu role
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'FORBIDDEN'
        });
      }

      // 👉 attach thêm info để dùng tiếp
      req.workspace = {
        id: workspaceId,
        role: userRole
      };

      next();
    } catch (err) {
      console.error('workspaceAuth error:', err);
      res.status(500).json({
        success: false,
        message: 'INTERNAL_SERVER_ERROR'
      });
    }
  };
};

export default workspaceAuth;