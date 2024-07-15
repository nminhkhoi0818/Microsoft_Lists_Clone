import { v4 as uuidv4 } from "uuid";

abstract class Column {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  abstract getValue(): any;
}

class TextColumn extends Column {
  value: string;

  constructor(name: string, value: string = "") {
    super(name);
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

class DateColumn extends Column {
  value: Date;

  constructor(name: string, value: Date) {
    super(name);
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

export { Column, TextColumn, DateColumn };
