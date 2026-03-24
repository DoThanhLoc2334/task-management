import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên workspace là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

workspaceSchema.pre('save', async function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

workspaceSchema.pre(/^find/, async function () {
  this.where({ deletedAt: null });
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;