import Tesseract from "tesseract.js";
import fs from "fs";
import Files from "../models/uploadFile";

// Function to perform OCR on the image and extract text
async function performOCR(imagePath) {
  const { data } = await Tesseract.recognize(imagePath, "eng", {
    tessjs_create_pdf: "1", // Enable PDF creation for table extraction
  }).then((result) => {
    return result;
  });

  return data;
}

// Function to extract table data from OCR result and convert to CSV
function extractTableData(ocrData) {
  // console.log(ocrData.text);
  const lines = ocrData.text.split("\n");
  const tableData = [];
  let tableStartIndex = -1;
  let tableEndIndex = -1;

  // Find the start and end indices of the table
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Bank")) {
      tableStartIndex = i + 1;
    } else if (lines[i].includes("Page")) {
      tableEndIndex = i;
      break;
    }
  }

  // Extract table rows
  for (let i = tableStartIndex; i < tableEndIndex; i++) {
    const row = lines[i]
      .replaceAll("[", "|")
      .replaceAll("]", "|")
      .split("|")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    if (row.length > 1) tableData.push(row);
    // console.log(row);
  }

  return tableData;
}

// Function to convert table data to CSV format
function convertToCSV(tableData, iterationCount) {
  let csvContent;
  if (iterationCount === 0) {
    const headers = [
      "date",
      "sender",
      "senderName",
      "receiver",
      "receiverName",
      "amount",
    ];
    csvContent = headers.join(",") + "\n";
  } else {
    csvContent = "";
  }

  tableData.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}

// Function to process multiple images
export async function processImages(imagePaths, outputCSVPath, onSuccess) {
  fs.writeFileSync(outputCSVPath, "", "utf8"); // Clear the output file
  for (var i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    console.log(`Processing image: ${imagePath}`);
    try {
      const ocrData = await performOCR(imagePath);
      const tableData = extractTableData(ocrData);
      const csvContent = convertToCSV(tableData, i);

      fs.appendFile(outputCSVPath, csvContent, (error) => {
        if (error) console.log(error);
        console.log(`Image processed successfully: ${imagePath}`);
      });
      if (imagePaths.length - 1 === i) {
        onSuccess(outputCSVPath);
      }
    } catch (err) {
      console.error(`Error processing image: ${imagePath}`, err);
    }
  }
  return true;
}

// // Example usage
// const imagePaths = ["./test/1.png", "./test/2.png", "./test/3.png"]; // Provide an array of image paths
// const csvPath = "./output.csv"; // Provide the path where the CSV file will be saved

// processImages(imagePaths, csvPath);
