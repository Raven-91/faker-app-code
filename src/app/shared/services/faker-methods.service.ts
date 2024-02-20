import {Injectable} from '@angular/core';
import {Faker, fakerEN_US, fakerKO, fakerRU} from "@faker-js/faker";
import {FakerMethodsTypes} from "../../types/faker-methods-types";

@Injectable({
  providedIn: 'root'
})
export class FakerMethodsService {

  fakerMethods: FakerMethodsTypes = {
    EN_US: fakerEN_US,
    KO: fakerKO,
    RU: fakerRU,
  }

  getCurrentFakerMethod(selectedValue: string): Faker | undefined {
    if (selectedValue) {
      return (this.fakerMethods[selectedValue]);
    } else {
      return;
    }
  }
}
