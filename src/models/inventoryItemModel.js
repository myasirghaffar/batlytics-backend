import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventorySession",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fullBottles: { type: Number, default: 0 },
    fillLevel: { type: Number, default: 100, min: 0, max: 100 },
  },
  { timestamps: true }
);

inventoryItemSchema.index({ sessionId: 1 });
inventoryItemSchema.index({ productId: 1 });

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;
