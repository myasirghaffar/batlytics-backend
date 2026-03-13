import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as productService from "../services/productService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getProducts = catchAsyncErrors(async (req, res) => {
  const products = await productService.listProducts(req.query);
  return success(res, HTTP_STATUS.OK, "Success", products);
});

export const searchProducts = catchAsyncErrors(async (req, res) => {
  const products = await productService.searchProducts(req.query);
  return success(res, HTTP_STATUS.OK, "Success", products);
});

export const getProductById = catchAsyncErrors(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return success(res, HTTP_STATUS.OK, "Success", product);
});

export const createProduct = catchAsyncErrors(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return success(
    res,
    HTTP_STATUS.CREATED,
    "Product created successfully",
    product
  );
});

export const updateProduct = catchAsyncErrors(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return success(res, HTTP_STATUS.OK, "Product updated successfully", product);
});

export const updateProductFillLevel = catchAsyncErrors(async (req, res) => {
  const { fillLevel } = req.body;
  const product = await productService.updateProductFillLevel(
    req.params.id,
    fillLevel
  );
  return success(res, HTTP_STATUS.OK, "Fill level updated", product);
});

export const updateProductPrice = catchAsyncErrors(async (req, res) => {
  const { price } = req.body;
  const product = await productService.updateProductPrice(req.params.id, price);
  return success(res, HTTP_STATUS.OK, "Price updated", product);
});

export const deleteProduct = catchAsyncErrors(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return success(res, HTTP_STATUS.OK, "Product deleted successfully");
});
