import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema(
  {
    Original_URL: {
      type: String,
      required: true,
      trim: true,
    },
    Short_Code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Click_Count: {
      type: Number,
      default: 0,
      min: 0,
    },
    Created_At: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

export default mongoose.model('Url', UrlSchema);
