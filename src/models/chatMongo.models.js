import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    author: {
      email: { type: String, required: true },
      email: { type: String },
      type: { type: String, enum: ['usuario', 'sistema'] },
      date: { type: String },
    },
    message: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export { chatSchema };
