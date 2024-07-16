import { v4 as uuidv4 } from "uuid";
import { ColumnType } from "./Enum";

abstract class Column {
  id: string;
  name: string;
  type: ColumnType;

  constructor(name: string, type: ColumnType) {
    this.id = uuidv4();
    this.name = name;
    this.type = type;
  }

  abstract setValue(value: any): void;
  abstract getValue(): any;
}

class TextColumn extends Column {
  value: string;

  constructor(name: string = "", value: string = "") {
    super(name, ColumnType.Text);
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
    super(name, ColumnType.Number);
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
    super(name, ColumnType.YesNo);
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
    super(name, ColumnType.Date);
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
  value: string;
  options: string[];

  constructor(name: string = "", options: string[] = [], value: string = "") {
    super(name, ColumnType.Choice);
    this.value = value;
    this.options = options;
  }

  addOption(option: string) {
    this.options.push(option);
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
};
