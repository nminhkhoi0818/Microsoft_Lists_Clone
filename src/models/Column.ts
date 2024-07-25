import { v4 as uuidv4 } from "uuid";
import { EnumChoiceType, EnumColumnType } from "./Enum";

abstract class Column {
  id: string;
  name: string;
  type: EnumColumnType;
  isHidden: boolean;

  constructor(id: string, name: string, type: EnumColumnType) {
    this.id = id || uuidv4();
    this.name = name;
    this.type = type;
    this.isHidden = false;
  }

  abstract setValue(value: any): void;
  abstract getValue(): any;
}

class TextColumn extends Column {
  value: string;

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.Text);
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

  constructor(id: string, name: string = "", value: number = 0) {
    super(id, name, EnumColumnType.Number);
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

  constructor(id: string, name: string = "", value: boolean = false) {
    super(id, name, EnumColumnType.YesNo);
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

  constructor(id: string, name: string = "", value: Date = new Date()) {
    super(id, name, EnumColumnType.Date);
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

  constructor(
    id: string,
    name: string,
    selectionType: EnumChoiceType = EnumChoiceType.Single,
    options: string[] = []
  ) {
    super(id, name, EnumColumnType.Choice);
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

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.Hyperlink);
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

  constructor(id: string, name: string = "", value: number = 0) {
    super(id, name, EnumColumnType.Currency);
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

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.Location);
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

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.Image);
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

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.ManagedMetadata);
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

  constructor(id: string, name: string = "", value: string = "") {
    super(id, name, EnumColumnType.Lookup);
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
