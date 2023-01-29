import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productName: { type: String },
      },
    ],
    serial: { type: String },
    state: { type: String, default: 'Generated' },
    email: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export { orderSchema };
