import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

areaSchema.index({ name: 1 });

const Area = mongoose.model("Area", areaSchema);

export default Area;
