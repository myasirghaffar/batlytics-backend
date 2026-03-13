import mongoose from "mongoose";

const inventorySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    areaName: { type: String, default: "", trim: true },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    team: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

inventorySessionSchema.index({ userId: 1 });
inventorySessionSchema.index({ areaId: 1 });
inventorySessionSchema.index({ createdAt: -1 });

const InventorySession = mongoose.model("InventorySession", inventorySessionSchema);

export default InventorySession;
