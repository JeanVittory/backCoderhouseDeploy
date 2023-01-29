import mongoose from 'mongoose';
import { categories } from '../tools/constants.tools.js';

const productsSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      enum: {
        values: categories,
        message: '{VALUE} is not a category available.',
      },
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export { productsSchema };
