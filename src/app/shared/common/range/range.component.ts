import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SliderRangeDataTypes} from "../../../types/slider-range-data-types";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-range',
  standalone: true,
  imports: [MatSlider, MatSliderThumb, MatFormField, MatInput, MatLabel, FormsModule],
  templateUrl: './range.component.html',
  styleUrl: './range.component.scss'
})
export class RangeComponent {
  @Input() sliderRange: SliderRangeDataTypes = {
    max: 0,
    min: 0,
    step: 0,
    value: 0,
    thumbLabel: false,
    showTicks: false,
  };
  @Output() changeRangeValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('slider') slider!: ElementRef<HTMLInputElement>;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  onChangeRange(value: string): void {
    value ? this.setInputValue(value) : false;
  }

  onChangeInput(value: string): void {
    if (value) {
      this.setInputValue(value);
      this.setSliderValue(value);
    } else {
      return;
    }
  }

  private setSliderValue(value: string): void {
    value ? this.sliderRange.value = Number(value) : false;
  }

  private setInputValue(value: string): void {
    if (value) {
      const newValue: string = (Number(value) > 1000) ? '1000' : value;
      this.input.nativeElement.value = newValue;
      this.setSliderValue(`${Math.min(Number(newValue), this.sliderRange.max)}`);
      this.changeRangeValue.emit(newValue);
    } else {
      return;
    }
  }
}
