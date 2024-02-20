import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output
} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {DataStateInfoTypes} from "../../../types/data-state-info-types";


@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})

export class SelectComponent implements OnInit {
  @Input() selected: string = '';
  @Input() items: DataStateInfoTypes[] = [];
  @Output() changeSelectValue: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.selected) {
      this.changeSelectValue.emit(this.selected);
    }
  }

  onChangeSelect(event: { value: string }): void {
    (event && event.value) ? this.changeSelectValue.emit(event.value) : false;
  }
}
