import { v4 as uuidv4 } from "uuid";
import {
  ChoiceColumn,
  Column,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";

class Item {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns.map((col) => {
      if (col instanceof TextColumn) {
        return new TextColumn(col.name);
      }
      if (col instanceof NumberColumn) {
        return new NumberColumn(col.name);
      }
      if (col instanceof YesNoColumn) {
        return new YesNoColumn(col.name);
      }
      if (col instanceof DateColumn) {
        return new DateColumn(col.name);
      }
      if (col instanceof ChoiceColumn) {
        return new ChoiceColumn(col.name, col.options);
      }
      throw new Error("Unsupported column type");
    });
    // this.columns = columns;
  }

  setValueCol(name: string, value: any) {
    this.columns.forEach((column) => {
      if (column.name === name) {
        column.setValue(value);
      }
    });
  }

  getValueCol(name: string) {
    return this.columns.find((column) => column.name === name)?.getValue();
  }
}

export default Item;
