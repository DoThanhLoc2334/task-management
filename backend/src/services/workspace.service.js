import WorkspaceRepository from '../models/workspace.repository.js';
import db from '../config/db.js';
import AppError from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorCodes.js';

const WorkspaceService = {

  async createWorkspace(data, userId) {
    const { name, description } = data;

    // validate
    if (!name) {
      throw new AppError(ERROR_CODES.MISSING_NAME, 400, 'Name is required');
    }

    // create workspace
    const workspace = await WorkspaceRepository.create(name, description);

    // add creator vào workspace_members
    await db.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
      VALUES ($1, $2, 'OWNER', NOW())
      `,
      [workspace.id, userId]
    );

    return workspace;
  },

  async getUserWorkspaces(userId) {
    if (!userId) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    return await WorkspaceRepository.findByUser(userId);
  },

  async getWorkspaceById(workspaceId, userId) {

    //  validate input
    if (!workspaceId) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    const workspace = await WorkspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    //  check membership
    const result = await db.query(
      `
      SELECT role
      FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      `,
      [workspaceId, userId]
    );

    if (!result.rows.length) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    return {
      ...workspace,
      role: result.rows[0].role
    };
  },

  async addMember(workspaceId, userId, role, currentUserId) {

    if (!workspaceId || !userId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }

    //  check workspace tồn tại
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    //  check quyền (chỉ OWNER mới được thêm member)
    const ownerCheck = await db.query(
      `
    SELECT role
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, currentUserId]
    );

    if (!ownerCheck.rows.length || ownerCheck.rows[0].role !== 'OWNER') {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    //  check user đã ở trong workspace chưa
    const existing = await db.query(
      `
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, userId]
    );

    if (existing.rows.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'User already in workspace');
    }

    //  thêm member
    const result = await db.query(
      `
    INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING workspace_id, user_id, role, joined_at
    `,
      [workspaceId, userId, role || 'MEMBER']
    );

    return result.rows[0];
  },
  async changeRole(workspaceId, targetUserId, newRole, currentUserId) {

    //  validate input
    if (!workspaceId || !targetUserId || !newRole) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }

    //  validate role hợp lệ
    const validRoles = ['owner', 'moderator', 'member', 'guest'];

    if (!validRoles.includes(newRole)) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Invalid role');
    }

    //  không cho set OWNER (tránh conflict quyền)
    if (newRole === 'OWNER') {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Cannot assign OWNER role');
    }

    //  check workspace tồn tại
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    //  check current user có phải OWNER không
    const currentUser = await db.query(
      `
    SELECT role
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, currentUserId]
    );

    if (!currentUser.rows.length || currentUser.rows[0].role !== 'OWNER') {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    // check target user có trong workspace không
    const targetUser = await db.query(
      `
    SELECT role
    FROM workspace_members
    WHERE workspace_id = $1 AND user_id = $2
    `,
      [workspaceId, targetUserId]
    );

    if (!targetUser.rows.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Member not found');
    }

    //  không cho đổi role của OWNER
    if (targetUser.rows[0].role === 'OWNER') {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Cannot change OWNER role');
    }

    // update role
    const result = await db.query(
      `
    UPDATE workspace_members
    SET role = $1
    WHERE workspace_id = $2 AND user_id = $3
    RETURNING workspace_id, user_id, role
    `,
      [newRole, workspaceId, targetUserId]
    );

    return result.rows[0];
  },

  async leaveWorkspace(workspaceId, userId) {
    if (!workspaceId || !userId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }

    // Kiểm tra workspace tồn tại
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    // Kiểm tra user có trong workspace không
    const membership = await db.query(
      `SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, userId]
    );

    if (!membership.rows.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'You are not a member of this workspace');
    }

    // Không cho Owner leave nếu là Owner cuối cùng (tùy bạn có muốn check không)
    // Nếu muốn nghiêm ngặt: kiểm tra còn Owner nào khác không...

    await db.query(
      `DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, userId]
    );

    return { message: 'Left workspace successfully' };
  },

  async removeMember(workspaceId, targetUserId, currentUserId) {
    if (!workspaceId || !targetUserId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }

    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }

    // Kiểm tra currentUser phải là OWNER
    const currentUser = await db.query(
      `SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, currentUserId]
    );

    if (!currentUser.rows.length || currentUser.rows[0].role !== 'OWNER') {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403, 'Only Owner can remove members');
    }

    // Kiểm tra target user tồn tại
    const targetUser = await db.query(
      `SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, targetUserId]
    );

    if (!targetUser.rows.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Member not found');
    }

    if (targetUser.rows[0].role === 'OWNER') {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Cannot remove OWNER');
    }

    // Không cho Owner tự remove chính mình qua hàm này
    if (currentUserId === targetUserId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Owner cannot remove themselves using remove member. Please use Leave Workspace instead.');
    }

    await db.query(
      `DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, targetUserId]
    );

    return { message: 'Member removed successfully' };
  },
  async deleteWorkspace(workspaceId, userId) {
    if (!workspaceId || !userId) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 400, 'Missing required fields');
    }
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError(ERROR_CODES.WORKSPACE_NOT_FOUND, 404);
    }
    
  }
};

export default WorkspaceService;