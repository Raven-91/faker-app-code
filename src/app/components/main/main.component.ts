import {Component, HostListener, inject, OnInit} from '@angular/core';
import {SelectComponent} from "../../shared/common/select/select.component";
import {DataStateInfoTypes} from "../../types/data-state-info-types";
import {RangeComponent} from "../../shared/common/range/range.component";
import {CsvExportComponent} from "../../shared/common/csv-export/csv-export.component";
import {SeedInputComponent} from "../../shared/common/seed-input/seed-input.component";
import {TableComponent} from "../../shared/common/table/table.component";
import {TableDataTypes} from "../../types/table-data-types";
import {SliderRangeDataTypes} from "../../types/slider-range-data-types";
import {Faker, faker} from "@faker-js/faker";
import {OptionTypes} from "../../types/option-types";
import {FakerMethodsService} from "../../shared/services/faker-methods.service";
import {FakerHelpersService} from "../../shared/services/faker-helpers.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SelectComponent,
    RangeComponent,
    CsvExportComponent,
    SeedInputComponent,
    TableComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private fakerMethodsService = inject(FakerMethodsService);
  private fakerHelpersService = inject(FakerHelpersService);

  selectedValue: string = '';
  rangeValue: string = '';
  seedValue: string = '';

  selectData: DataStateInfoTypes[] = [
    {
      option: OptionTypes.optionUS,
      state: 'USA',
    },
    {
      option: OptionTypes.optionRU,
      state: 'Russia',
    },
    {
      option: OptionTypes.optionKO,
      state: 'Korea',
    },
  ];

  sliderRange: SliderRangeDataTypes = {
    max: 10,
    min: 0,
    step: 0.25,
    value: 0,
    thumbLabel: true,
    showTicks: true,
  }

  tableDate: TableDataTypes[] = [];

  displayedColumns: string[] = ['position', 'id', 'name', 'address', 'phone']

  ngOnInit(): void {
    this.selectedValue = this.selectData[0].option;
    this.rangeValue = '0';
    this.seedValue = String(faker.seed());
  }

  processChangeState(selectedValue: string): void {
    this.selectedValue = selectedValue ? selectedValue : '';
    this.termsAndUpdateTableData();
  }

  processChangeRange(rangeValue: string): void {
    if (Number(rangeValue) < 0) {
      this.rangeValue = '0';
    } else {
      this.rangeValue = rangeValue;
    }
    this.termsAndUpdateTableData();
  }

  processChangeSeed(seedValue: string): void {
    this.seedValue = seedValue ? seedValue : '';
    this.termsAndUpdateTableData();
  }

  private generateTableData(currentFakerMethod: Faker, numberErrors: number, numberRows: number): TableDataTypes[] | undefined {
    if (currentFakerMethod && numberRows) {
      for (let i = 0; i < numberRows; i++) {
        const personData: TableDataTypes | undefined = this.createPersonData(currentFakerMethod, numberErrors);
        if (personData) {
          this.tableDate.push(personData);
        } else {
          return;
        }
      }
      if (this.tableDate && this.tableDate.length > 0) {
        return this.tableDate;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  private createPersonData(fakerMethod: Faker, numberErrors: number): TableDataTypes | undefined {
    const personData: TableDataTypes = {
      id: '',
      name: '',
      address: '',
      phone: ''
    };
    if (fakerMethod) {
      if (numberErrors === 0) {
        personData.id = fakerMethod.database.mongodbObjectId();
        personData.name = fakerMethod.person.fullName();
        personData.address = `${fakerMethod.location.streetAddress()}, ${fakerMethod.location.city()}, ${fakerMethod.location.state()}`;
        personData.phone = fakerMethod.phone.number();
      }

      if (numberErrors > 0) {
        personData.id = fakerMethod.database.mongodbObjectId();
        personData.name = (this.fakerHelpersService.generateErrorsInData(
          fakerMethod.person.fullName(), this.selectedValue, Number(this.rangeValue), false) as string);
        personData.address = `
        ${(this.fakerHelpersService.generateErrorsInData(
          fakerMethod.location.streetAddress(), this.selectedValue, Number(this.rangeValue), false) as string)},
        ${(this.fakerHelpersService.generateErrorsInData(
          fakerMethod.location.city(), this.selectedValue, Number(this.rangeValue), false) as string)},
         ${(this.fakerHelpersService.generateErrorsInData(
          fakerMethod.location.state(), this.selectedValue, Number(this.rangeValue), false) as string)}`
        personData.phone = (this.fakerHelpersService.generateErrorsInData(
          fakerMethod.phone.number(), this.selectedValue, Number(this.rangeValue), true) as string);
      }

      if (personData && personData.id && personData.name && personData.address && personData.phone) {
        return personData;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  private updateTableData(selectedValue: string, seedValue: string, numberErrors: number, numberRows: number): void {
    const currentFakerMethod: Faker | undefined = this.fakerMethodsService.getCurrentFakerMethod(selectedValue);
    if (currentFakerMethod && seedValue && (numberErrors || !numberErrors) && numberRows) {
      this.tableDate = [];
      currentFakerMethod.seed(Number(seedValue));
      this.generateTableData(currentFakerMethod, numberErrors, numberRows);
    } else {
      return;
    }
  }

  private termsAndUpdateTableData(): void {
    if (this.tableDate && this.tableDate.length > 0) {
      if (this.selectedValue && this.rangeValue && this.seedValue) {
        this.updateTableData(this.selectedValue, this.seedValue, Number(this.rangeValue), this.tableDate.length);
      } else {
        return;
      }
    } else if (this.tableDate && this.tableDate.length < 1) {
      if (this.selectedValue && this.rangeValue && this.seedValue) {
        this.updateTableData(this.selectedValue, this.seedValue, Number(this.rangeValue), 20);
      } else return;
    } else {
      return;
    }
  }

  private step: number = 500;

  @HostListener('document:scroll') scrollFunction(): number | undefined {
    if ((window.scrollY || document.documentElement.scrollTop) > this.step) {
      const currentFakerMethod: Faker | undefined = this.fakerMethodsService.getCurrentFakerMethod(this.selectedValue);
      if (currentFakerMethod) {
        this.generateTableData(currentFakerMethod, Number(this.rangeValue), 10);
        if (this.tableDate && this.tableDate.length > 0 && this.selectedValue && this.seedValue) {
          this.updateTableData(this.selectedValue, this.seedValue, Number(this.rangeValue), this.tableDate.length);
          return this.step += 300;
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }
}
