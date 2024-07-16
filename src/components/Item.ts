import { v4 as uuidv4 } from "uuid";
import {
  ChoiceColumn,
  Column,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import { ColumnType } from "./Enum";

class ColumnFactory {
  static mapColumn: { [key: string]: () => Column } = {
    [ColumnType.Text]: () => new TextColumn("", ""),
    [ColumnType.Number]: () => new NumberColumn("", 0),
    [ColumnType.YesNo]: () => new YesNoColumn("", false),
    [ColumnType.Date]: () => new DateColumn("", new Date()),
    [ColumnType.Choice]: () => new ChoiceColumn("", []),
  };

  static createColumn(type: ColumnType, name: string): Column {
    const column = this.mapColumn[type]();
    column.name = name;
    return column;
  }
}

class Item {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns.map((column) => {
      return ColumnFactory.createColumn(column.type, column.name);
    });
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
