import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {TableDataTypes} from "../../types/table-data-types";

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {
  exportTableEToExcel(tableData: TableDataTypes[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }
}
