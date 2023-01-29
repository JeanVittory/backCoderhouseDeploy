import mongoose from 'mongoose';
import { categories } from '../tools/constants.tools.js';

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      enum: {
        values: categories,
        message: '{VALUE} is not a category available.',
      },
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export { categoriesSchema };
