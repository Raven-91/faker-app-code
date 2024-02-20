import {Component, inject, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {ExportCsvService} from "../../services/export-csv.service";
import {TableDataTypes} from "../../../types/table-data-types";

@Component({
  selector: 'app-csv-export',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './csv-export.component.html',
  styleUrls: [
    '../../../../styles.scss',
    './csv-export.component.scss'
  ]
})
export class CsvExportComponent {
  private exportCsvService = inject(ExportCsvService);
  @Input() tableDate: TableDataTypes[] = [];

  private formatTableData(tableDate: TableDataTypes[]): TableDataTypes[] | undefined {
    if (tableDate && tableDate.length > 0) {
      return tableDate.map((item: TableDataTypes, index: number) => {
        item.position = index + 1;
        return this.updateTablePosition(item);
      });
    } else {
      return;
    }
  }

  onUploadFiles(): void {
    const data: TableDataTypes[] | undefined = this.formatTableData(this.tableDate);
    if (data) {
      this.exportCsvService.exportTableEToExcel(data, 'Users-data');
    } else {
      return;
    }
  }

  private updateTablePosition(item: TableDataTypes): TableDataTypes {
    const positions = Object.entries(item);
    positions.unshift(positions[positions.length - 1]);
    positions.pop();
    return (Object.fromEntries(positions) as TableDataTypes);
  }
}
