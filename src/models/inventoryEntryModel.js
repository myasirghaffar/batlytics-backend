import mongoose from "mongoose";

const inventoryEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    fillLevel: {
      type: Number,
      required: true,
      min: [0, "Fill level must be between 0 and 100"],
      max: [100, "Fill level must be between 0 and 100"],
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

inventoryEntrySchema.index({ userId: 1 });
inventoryEntrySchema.index({ productId: 1 });
inventoryEntrySchema.index({ lastUpdated: -1 });

const InventoryEntry = mongoose.model("InventoryEntry", inventoryEntrySchema);

export default InventoryEntry;
