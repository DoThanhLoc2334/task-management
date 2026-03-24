import express from 'express'; 
import { protect } from '../middleware/authMiddleware.js';
// import { requireWorkspaceMember, requireWorkspaceRole } from '../middleware/workspaceAuth.js';
import * as workspaceController from '../controllers/workspaceController.js';
const router = express.Router();
// router.use(protect);
const mockAuth = (req, res, next) => {
  req.user = { _id: '64a1b2c3d4e5f6a7b8c9d0e1' };
  next();
};

router.use(mockAuth);
router.route('/')
  .get(workspaceController.getWorkspaces)
  .post(workspaceController.createWorkspace);

router.route('/:workspaceId')
  .get(workspaceController.getWorkspaceById)
  .patch(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

// router.route('/:workspaceId')
//   .get(requireWorkspaceMember, workspaceController.getWorkspaceById)
//   .patch(requireWorkspaceMember, requireWorkspaceRole('owner', 'admin'), workspaceController.updateWorkspace)
//   .delete(requireWorkspaceMember, requireWorkspaceRole('owner'), workspaceController.deleteWorkspace);

// router.route('/:workspaceId/members')
//   .get(requireWorkspaceMember, workspaceController.getMembers)
//   .post(requireWorkspaceMember, requireWorkspaceRole('owner', 'admin'), workspaceController.addMember);

// router.route('/:workspaceId/members/:memberId')
//   .patch(requireWorkspaceMember, requireWorkspaceRole('owner', 'admin'), workspaceController.updateMemberRole)
//   .delete(requireWorkspaceMember, workspaceController.removeMember);

export default router;