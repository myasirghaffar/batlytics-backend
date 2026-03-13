import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    category: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    imageURL: { type: String, default: "", trim: true },
    volume: { type: Number, default: 0 },
    unitSize: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    fillLevel: { type: Number, default: 100, min: 0, max: 100 },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, areaId: 1 });
productSchema.index({ areaId: 1 });
productSchema.index({ categoryId: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
