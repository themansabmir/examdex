import * as XLSX from "xlsx";
import { BadRequestError } from "../../utils";

export class ExcelService {
  /**
   * Parses an Excel file buffer into an array of objects
   */
  static parseExcel<T>(buffer: Buffer): T[] {
    try {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new BadRequestError("The Excel file is empty or invalid");
      }

      const data = XLSX.utils.sheet_to_json<T>(worksheet);
      return data;
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError("Failed to parse Excel file");
    }
  }

  /**
   * Validates that required headers are present in the parsed data
   */
  static validateHeaders(data: any[], requiredHeaders: string[]): void {
    if (data.length === 0) return;

    const firstRow = data[0];
    const headers = Object.keys(firstRow);

    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

    if (missingHeaders.length > 0) {
      throw new BadRequestError(`Missing required headers: ${missingHeaders.join(", ")}`);
    }
  }
}
