import WorkspaceMember from '../models/WorkspaceMember.js';
import AppError from '../Utils/AppError.js';
import catchAsync from '../Utils/catchAsync.js';

// Kiểm tra user có là thành viên của workspace không
export const requireWorkspaceMember = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;

  const membership = await WorkspaceMember.findOne({
    workspaceId,
    userId: req.user._id,
  });

  if (!membership) {
    throw new AppError('Bạn không có quyền truy cập workspace này.', 403, 'FORBIDDEN');
  }

  req.membership = membership; // gắn vào req để dùng lại, không query lại lần 2
  next();
});

// Factory function — tạo middleware kiểm tra role cụ thể
export const requireWorkspaceRole = (...roles) =>
  catchAsync(async (req, res, next) => {
    // requireWorkspaceMember phải chạy trước, nên req.membership đã có sẵn
    if (!req.membership) {
      throw new AppError('Middleware thứ tự sai: requireWorkspaceMember phải chạy trước.', 500);
    }

    if (!roles.includes(req.membership.role)) {
      throw new AppError('Bạn không đủ quyền thực hiện hành động này.', 403, 'FORBIDDEN');
    }

    next();
  });