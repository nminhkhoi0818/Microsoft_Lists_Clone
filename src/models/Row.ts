import { v4 as uuidv4 } from "uuid";
import {
  ChoiceColumn,
  Column,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import { EnumColumnType } from "./Enum";

class ColumnFactory {
  static mapColumn: { [key: string]: (id: string, name: string) => Column } = {
    [EnumColumnType.Text]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Number]: (id, name) => new NumberColumn(id, name),
    [EnumColumnType.YesNo]: (id, name) => new YesNoColumn(id, name),
    [EnumColumnType.Date]: (id, name) => new DateColumn(id, name),
    [EnumColumnType.Choice]: (id, name) => new ChoiceColumn(id, name),
    [EnumColumnType.Hyperlink]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Currency]: (id, name) => new NumberColumn(id, name),
    [EnumColumnType.Location]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Image]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.ManagedMetadata]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Lookup]: (id, name) => new TextColumn(id, name),
  };

  static loadColumn(id: string, type: EnumColumnType, name: string): Column {
    const column = this.mapColumn[type](id, name);
    return column;
  }

  static createColumn(type: string, name: string): Column {
    const column = this.mapColumn[type](uuidv4(), name);
    return column;
  }
}

class Row {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns.map((column) => {
      return ColumnFactory.loadColumn(column.id, column.type, column.name);
    });
  }

  addColumn(column: Column) {
    this.columns.push(
      ColumnFactory.loadColumn(column.id, column.type, column.name)
    );
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

export { Row, ColumnFactory };
