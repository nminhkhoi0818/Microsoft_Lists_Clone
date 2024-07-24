import { v4 as uuidv4 } from "uuid";
import { EnumChoiceType, EnumColumnType } from "./Enum";

abstract class Column {
  id: string;
  name: string;
  type: EnumColumnType;
  isHidden: boolean;

  constructor(name: string, type: EnumColumnType) {
    this.id = uuidv4();
    this.name = name;
    this.type = type;
    this.isHidden = false;
  }

  abstract setValue(value: any): void;
  abstract getValue(): any;
}

class TextColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.Text);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class NumberColumn extends Column {
  value: number;

  constructor(name: string = "", value: number = 0) {
    super(name, EnumColumnType.Number);
    this.value = value;
  }

  setValue(value: number) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class YesNoColumn extends Column {
  value: boolean;

  constructor(name: string = "", value: boolean = false) {
    super(name, EnumColumnType.YesNo);
    this.value = value;
  }

  setValue(value: any): void {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class DateColumn extends Column {
  value: Date;

  constructor(name: string = "", value: Date = new Date()) {
    super(name, EnumColumnType.Date);
    this.value = value;
  }

  setValue(value: Date) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class ChoiceColumn extends Column {
  value!: string | string[];
  selectionType: EnumChoiceType;
  options: string[];

  constructor(name: string, selectionType: EnumChoiceType, options: string[]) {
    super(name, EnumColumnType.Choice);
    this.selectionType = selectionType;
    this.options = options;
  }

  addOption(option: string) {
    this.options.push(option);
  }

  setValue(value: string | string[]) {
    if (Array.isArray(value)) {
      let valueOption = this.options.filter((option) => {
        return value.includes(option);
      });
      this.value = valueOption;
    }
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class HyperLinkColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.Hyperlink);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class CurrencyColumn extends Column {
  value: number;
  decimalPlaces: number;
  currencyFormat: string;
  defaultValue: number;

  constructor(name: string = "", value: number = 0) {
    super(name, EnumColumnType.Currency);
    this.value = value;
    this.decimalPlaces = 2;
    this.currencyFormat = "USD";
    this.defaultValue = 0;
  }

  setValue(value: number) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class LocationColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.Location);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class ImageColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.Image);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class ManagedMetadataColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.ManagedMetadata);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class LookupColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, EnumColumnType.Lookup);
    this.value = value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

export {
  Column,
  TextColumn,
  DateColumn,
  NumberColumn,
  YesNoColumn,
  ChoiceColumn,
  HyperLinkColumn,
  CurrencyColumn,
  LocationColumn,
  ImageColumn,
  ManagedMetadataColumn,
  LookupColumn,
};
