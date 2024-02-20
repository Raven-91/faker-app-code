import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSliderThumb} from "@angular/material/slider";
import {ReactiveFormsModule} from "@angular/forms";
import {faker} from "@faker-js/faker";

@Component({
  selector: 'app-seed-input',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatSliderThumb,
    ReactiveFormsModule
  ],
  templateUrl: './seed-input.component.html',
  styleUrls: [
    '../../../../styles.scss',
    './seed-input.component.scss'
  ]
})
export class SeedInputComponent {
  seedInputValue: string = '';
  @Input() initialSeedInputValue: string = '';
  @Output() changeSeedInputValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('seedInput') seedInput!: ElementRef<HTMLInputElement>;

  onSeedChange(value: string): void {
    if (value) {
      this.seedInputValue = value;
      this.changeSeedInputValue.emit(this.seedInputValue);
    } else {
      return;
    }
  }

  randomSeedValue(): void {
    this.seedInputValue = String(faker.seed());
    this.seedInput.nativeElement.value = this.seedInputValue;
    this.changeSeedInputValue.emit(this.seedInputValue);
  }
}
