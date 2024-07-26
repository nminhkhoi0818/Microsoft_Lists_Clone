import { v4 as uuidv4 } from "uuid";
import {
  ChoiceColumn,
  Column,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import { EnumChoiceType, EnumColumnType } from "./Enum";

class ColumnFactory {
  static mapColumn: {
    [key: string]: (
      id: string,
      name: string,
      selectionType?: EnumChoiceType,
      options?: string[]
    ) => Column;
  } = {
    [EnumColumnType.Text]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Number]: (id, name) => new NumberColumn(id, name),
    [EnumColumnType.YesNo]: (id, name) => new YesNoColumn(id, name),
    [EnumColumnType.Date]: (id, name) => new DateColumn(id, name),
    [EnumColumnType.Choice]: (id, name, selectionType, options) =>
      new ChoiceColumn(id, name, selectionType, options),
    [EnumColumnType.Hyperlink]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Currency]: (id, name) => new NumberColumn(id, name),
    [EnumColumnType.Location]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Image]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.ManagedMetadata]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Lookup]: (id, name) => new TextColumn(id, name),
  };

  static loadColumn(data: any): Column {
    const { id, type, name, options, selectionType } = data;
    const column = this.mapColumn[type](id, name, selectionType, options);
    return column;
  }

  static createColumn(data: any): Column {
    const { type, name, options, selectionType } = data;
    const column = this.mapColumn[type](uuidv4(), name, selectionType, options);
    return column;
  }
}

class Row {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns.map((column) => {
      return ColumnFactory.loadColumn(column);
    });
  }

  addColumn(column: Column) {
    this.columns.push(ColumnFactory.loadColumn(column));
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
