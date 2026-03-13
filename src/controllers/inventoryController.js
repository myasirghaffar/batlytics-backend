import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import * as inventoryService from "../services/inventoryService.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../config/constants.js";

export const getInventory = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const result = await inventoryService.listInventoryWithProducts(userId, req.query);
  return success(res, HTTP_STATUS.OK, "Success", result);
});

export const createOrUpdateInventory = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const { productId, fillLevel } = req.body;
  const result = await inventoryService.createOrUpdateFillLevel(
    userId,
    productId,
    fillLevel
  );
  return success(res, HTTP_STATUS.OK, "Inventory updated successfully", result);
});

export const getInventoryReport = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id;
  const report = await inventoryService.getReport(userId, req.query);
  const format = (req.query.format || "json").toLowerCase();

  if (format === "excel" && report.products) {
    const exceljsModule = await import("exceljs");
    const ExcelJS = exceljsModule.default || exceljsModule;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Bar Inventory API";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Inventory Report", {
      headerFooter: { firstHeader: "Bar Inventory Report" },
    });
    sheet.columns = [
      { header: "Product", key: "product", width: 22 },
      { header: "Category", key: "category", width: 12 },
      { header: "Fill %", key: "fillLevel", width: 10 },
      { header: "Volume", key: "volume", width: 12 },
      { header: "Price", key: "price", width: 12 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const row of report.products) {
      sheet.addRow({
        product: row.name,
        category: row.category ?? "",
        fillLevel: row.fillLevel,
        volume: row.volume,
        price: row.price,
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=inventory-report-${Date.now()}.xlsx`
    );
    await workbook.xlsx.write(res);
    return;
  }

  return success(res, HTTP_STATUS.OK, "Report generated", report);
});
