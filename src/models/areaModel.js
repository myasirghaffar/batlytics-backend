import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

areaSchema.index({ userId: 1, name: 1 }, { unique: true });

const Area = mongoose.model("Area", areaSchema);

export default Area;
