import Area from "../models/areaModel.js";
import Product from "../models/productModel.js";
import logger from "../utils/logger.js";

export async function seedDefaultArea() {
  const count = await Area.countDocuments();
  if (count === 0) {
    const area = await Area.create({ name: "Cocktailstation" });
    logger.info(`Created default area: ${area.name} (${area._id})`);

    const extraAreas = ["Küche", "Lager", "Regal links", "Regal rechts"];
    for (const name of extraAreas) {
      await Area.create({ name });
    }
    logger.info("Created seed areas");
  }
}

export async function migrateProductsWithoutArea() {
  const productsWithoutArea = await Product.countDocuments({
    $or: [{ areaId: { $exists: false } }, { areaId: null }],
  });
  if (productsWithoutArea > 0) {
    const defaultArea = await Area.findOne().sort({ name: 1 });
    if (defaultArea) {
      await Product.updateMany(
        { $or: [{ areaId: { $exists: false } }, { areaId: null }] },
        { $set: { areaId: defaultArea._id } }
      );
      logger.info(`Migrated ${productsWithoutArea} products to default area`);
    }
  }
}
