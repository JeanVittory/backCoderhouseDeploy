import mongoose, { Schema } from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    product: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String, required: true },
      },
    ],
  },
  { versionKey: false }
);

export { cartSchema };
