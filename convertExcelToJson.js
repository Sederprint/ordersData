const xlsx = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = xlsx.readFile(
  "C:/Users/ודקרפב/Desktop/data for orders/list of items.xlsx"
);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert Excel to JSON
const items = xlsx.utils
  .sheet_to_json(worksheet, { header: 1 })
  .map((row) => row[0]) // Assuming item names are in the first column
  .filter((item) => item); // Filter out empty values

// Save JSON to a file
const jsonPath = "C:/Users/ודקרפב/Desktop/data for orders/items.json";
fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2), "utf-8");

console.log(`Item names saved to ${jsonPath}`);
