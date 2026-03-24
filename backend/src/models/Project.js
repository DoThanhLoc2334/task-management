import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên project là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
    },
    description: {
      type: String,
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
      default: '',
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'workspaceId là bắt buộc'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    settings: {
      isPrivate: { type: Boolean, default: false },
      background: { type: String, default: '#0079bf' },
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

projectSchema.pre(/^find/, async function () {
  this.where({ archivedAt: null });
});

const Project = mongoose.model('Project', projectSchema);
export default Project;