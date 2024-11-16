import { v4 as uuidv4 } from "uuid";
import { EnumColumnType } from "./Enum";

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

  abstract validate(value: any): boolean;
  abstract mapDataCol(data: string): Object;
}

class TextColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Text);
  }

  validate(value: any): boolean {
    return typeof value === "string";
  }

  mapDataCol(data: string) {
    return data;
  }
}
class NumberColumn extends Column {
  defaultValue: number;

  constructor(id: string, name: string = "", defaultValue: number = 0) {
    super(id, name, EnumColumnType.Number);
    this.defaultValue = defaultValue;
  }

  validate(value: any): boolean {
    return !isNaN(parseFloat(value));
  }

  mapDataCol(data: string) {
    return parseFloat(data);
  }
}

class YesNoColumn extends Column {
  defaultValue: string;

  constructor(id: string, name: string = "", defaultValue: string = "Yes") {
    super(id, name, EnumColumnType.YesNo);
    this.defaultValue = defaultValue;
  }

  validate(value: any): boolean {
    return parseInt(value) === 1 || parseInt(value) === 0;
  }

  mapDataCol(data: string) {
    const value = parseInt(data);
    return {
      value,
      displayText: value === 1 ? "Yes" : "No",
    };
  }
}

class DateColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Date);
  }

  validate(value: any): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  mapDataCol(data: string): Object {
    const date = new Date(data);
    return {
      isoDate: date.toISOString(),
      localDate: date.toLocaleDateString(),
    };
  }
}

class HyperLinkColumn extends Column {
  url: string;
  displayText: string;

  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Hyperlink);
    this.url = "";
    this.displayText = "";
  }

  validate(value: any): boolean {
    const [url, displayText] = value.split(", ");
    if (url && displayText) {
      this.url = url;
      this.displayText = displayText;
      return true;
    }
    return false;
  }

  mapDataCol(data: string) {
    const [url, displayText] = data.split(", ");

    return {
      url,
      displayText,
    };
  }
}

class ChoiceColumn extends Column {
  choices: string[];
  defaultValue: string;

  constructor(
    id: string,
    name: string,
    choices: string[] = [],
    defaultValue: string = ""
  ) {
    super(id, name, EnumColumnType.Choice);
    this.choices = choices;
    this.defaultValue = defaultValue;
  }

  addChoice(choice: string) {
    this.choices.push(choice);
  }

  validate(value: any): boolean {
    return this.choices.includes(value);
  }

  mapDataCol(data: string) {
    return data;
  }
}

class MultiChoiceColumn extends Column {
  choices: string[];
  defaultValue: string;

  constructor(
    id: string,
    name: string,
    choices: string[] = [],
    defaultValue: string = ""
  ) {
    super(id, name, EnumColumnType.MultiChoice);
    this.choices = choices;
    this.defaultValue = defaultValue;
  }

  addChoice(choice: string) {
    this.choices.push(choice);
  }

  removeChoice(choice: string) {
    this.choices = this.choices.filter((c) => c !== choice);
  }

  validate(value: any): boolean {
    const values = value.split(", ");
    return (
      Array.isArray(values) &&
      values.every((val: any) => this.choices.includes(val))
    );
  }

  mapDataCol(data: string): Object {
    return data.split(", ");
  }
}

class CurrencyColumn extends Column {
  decimalPlaces: number;
  currencyFormat: string;
  defaultValue: number;

  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Currency);
    this.decimalPlaces = 2;
    this.currencyFormat = "USD";
    this.defaultValue = 0;
  }

  validate(value: any): boolean {
    return typeof value === "number";
  }

  mapDataCol(data: string): Object {
    return parseFloat(data);
  }
}

class LocationColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Location);
  }

  validate(value: any): boolean {
    return typeof value === "string";
  }

  mapDataCol(data: string): Object {
    const [displayName, address] = data.split(", ");
    return {
      displayName,
      address,
    };
  }
}

class ImageColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Image);
  }

  validate(value: any): boolean {
    const [url, fileName] = value.split(", ");
    return typeof url === "string" && typeof fileName === "string";
  }

  mapDataCol(data: string): Object {
    const [url, fileName] = data.split(", ");
    return {
      url,
      fileName,
    };
  }
}

class PersonColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Person);
  }

  validate(value: any): boolean {
    return typeof value === "string";
  }

  mapDataCol(data: string): Object {
    const [title, picture, email] = data.split(", ");

    return {
      title,
      picture,
      email,
    };
  }
}

class ManagedMetadataColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.ManagedMetadata);
  }

  validate(value: any): boolean {
    return typeof value === "string";
  }

  mapDataCol(data: string): Object {
    return data;
  }
}

class LookupColumn extends Column {
  constructor(id: string, name: string = "") {
    super(id, name, EnumColumnType.Lookup);
  }

  validate(value: any): boolean {
    return typeof value === "string";
  }

  mapDataCol(data: string): Object {
    return data;
  }
}

export {
  Column,
  TextColumn,
  DateColumn,
  NumberColumn,
  YesNoColumn,
  ChoiceColumn,
  MultiChoiceColumn,
  PersonColumn,
  HyperLinkColumn,
  CurrencyColumn,
  LocationColumn,
  ImageColumn,
  ManagedMetadataColumn,
  LookupColumn,
};
