import {Injectable} from '@angular/core';
import {faker} from "@faker-js/faker";
import {FakerDataForErrorsTypes} from "../../types/faker-data-for-errors-types";

@Injectable({
  providedIn: 'root'
})
export class FakerHelpersService {
  dataForGeneratingErrors: FakerDataForErrorsTypes = {
    EN_US: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
      'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    RU: ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р',
      'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'],
    KO: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅑ',
      'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅉ', 'ㅆ', 'ㅢ', 'ㅚ', 'ㅐ', 'ㅟ', 'ㅔ', 'ㅒ', 'ㅖ',
      'ㅘ', 'ㅝ', 'ㅙ', 'ㅞ'],
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', ' ']
  }
  maxLength: number = 40;
  minLength: number = 3;

  private deleteSymbol(string: string): string | undefined {
    if (string) {
      const arrayFromString: string[] = string.split('');
      this.spliceArray(arrayFromString, 1);
      return arrayFromString.join('');
    } else {
      return;
    }
  }

  private addSymbol(string: string, stateOption: string, isPhone: boolean): string | undefined {
    if (string && stateOption) {
      const arrayFromString: string[] = string.split('');
      if (isPhone) {
        this.spliceArray(arrayFromString, 0, faker.helpers.arrayElement(this.dataForGeneratingErrors['numbers']));
        return arrayFromString.join('');
      } else {
        const category: string | undefined = Object.keys(this.dataForGeneratingErrors).find((item: string): string | undefined => {
          if (item === stateOption) {
            return stateOption;
          } else {
            return;
          }
        });
        if (category) {
          this.spliceArray(arrayFromString, 0, faker.helpers.arrayElement((this.dataForGeneratingErrors)[category]));
          return arrayFromString.join('');
        } else {
          return;
        }
      }
    } else {
      return;
    }
  }

  private swapSymbols(string: string): string | undefined {
    if (string) {
      const arrayFromString: string[] = string.split('');
      const randomIndex: number = faker.helpers.arrayElement(Array.from({length: arrayFromString.length}, (v, k: number) => k));
      const symbolForSwap: string = arrayFromString[randomIndex];
      if (symbolForSwap === arrayFromString[arrayFromString.length - 1]) {
        arrayFromString[randomIndex] = arrayFromString[0].toLowerCase();
        arrayFromString[0] = symbolForSwap.toUpperCase();
      } else {
        if (symbolForSwap === arrayFromString[0]) {
          arrayFromString[randomIndex] = arrayFromString[randomIndex + 1].toUpperCase();
          arrayFromString[randomIndex + 1] = symbolForSwap.toLowerCase();
        } else {
          arrayFromString[randomIndex] = arrayFromString[randomIndex + 1];
          arrayFromString[randomIndex + 1] = symbolForSwap;
        }
      }
      return arrayFromString.join('');
    } else {
      return;
    }
  }

  private spliceArray(array: string[], deleteCount: number, fakerRandomValue?: string): string[] | undefined {
    if (array && array.length > 0 && (deleteCount || !deleteCount)) {
      if (fakerRandomValue) {
        array.splice(faker.helpers.arrayElement(Array.from({length: array.length}, (v, k: number) => k)),
          deleteCount, fakerRandomValue);
        return array;
      } else {
        return array.splice(faker.helpers.arrayElement(Array.from({length: array.length}, (v, k: number) => k)),
          deleteCount);
      }
    } else {
      return;
    }
  }

  generateErrorsInData(string: string, stateOption: string, numberErrors: number, isPhone: boolean): string | undefined {
    if (string && stateOption && numberErrors) {
      const numberOfErrors: number = Math.trunc(numberErrors);
      const probabilityOfError: number = numberErrors - numberOfErrors;
      let result: string = string;
      for (let i = 0; i < numberOfErrors; i++) {
        result = (this.randomError(result, stateOption, isPhone) as string);
      }
      faker.helpers.maybe(() => {
        result = (this.randomError(result, stateOption, isPhone) as string);
      }, {probability: probabilityOfError});
      return result;
    } else {
      return;
    }
  }

  private randomError(string: string, stateOption: string, isPhone: boolean): string | undefined {
    if (string && stateOption) {
      let errorsMethods: (string | undefined)[] = [this.deleteSymbol(string), this.addSymbol(string, stateOption, isPhone), this.swapSymbols(string)];
      if (string.length < this.minLength) {
        errorsMethods = [this.addSymbol(string, stateOption, isPhone), this.swapSymbols(string)];
      }
      if (string.length > this.maxLength) {
        errorsMethods = [this.deleteSymbol(string), this.swapSymbols(string)];
      }
      return faker.helpers.arrayElement(errorsMethods);
    } else {
      return;
    }
  }
}
