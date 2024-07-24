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
  static mapColumn: { [key: string]: () => Column } = {
    [EnumColumnType.Text]: () => new TextColumn("", ""),
    [EnumColumnType.Number]: () => new NumberColumn("", 0),
    [EnumColumnType.YesNo]: () => new YesNoColumn("", false),
    [EnumColumnType.Date]: () => new DateColumn("", new Date(0)),
    [EnumColumnType.Choice]: () =>
      new ChoiceColumn("", EnumChoiceType.Single, []),
    [EnumColumnType.Hyperlink]: () => new TextColumn("", ""),
    [EnumColumnType.Currency]: () => new NumberColumn("", 0),
    [EnumColumnType.Location]: () => new TextColumn("", ""),
    [EnumColumnType.Image]: () => new TextColumn("", ""),
    [EnumColumnType.ManagedMetadata]: () => new TextColumn("", ""),
    [EnumColumnType.Lookup]: () => new TextColumn("", ""),
  };

  static createColumn(type: EnumColumnType, name: string): Column {
    const column = this.mapColumn[type]();
    column.name = name;

    return column;
  }
}

class Row {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns.map((column) => {
      if (column.type === EnumColumnType.Choice) {
        let choiceColumn = column as ChoiceColumn;
        return new ChoiceColumn(
          choiceColumn.name,
          choiceColumn.selectionType,
          choiceColumn.options
        );
      }
      return ColumnFactory.createColumn(column.type, column.name);
    });
  }

  addColumn(column: Column) {
    this.columns.push(ColumnFactory.createColumn(column.type, column.name));
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
