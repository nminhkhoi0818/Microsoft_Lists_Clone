import { v4 as uuidv4 } from "uuid";
import {
  ChoiceColumn,
  Column,
  CurrencyColumn,
  DateColumn,
  HyperLinkColumn,
  ImageColumn,
  LocationColumn,
  LookupColumn,
  ManagedMetadataColumn,
  MultiChoiceColumn,
  NumberColumn,
  PersonColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import { EnumColumnType } from "./Enum";

class ColumnFactory {
  private static mapColumn: {
    [key: string]: (
      id: string,
      name: string,
      defaultValue?: string,
      choices?: string[]
    ) => Column;
  } = {
    [EnumColumnType.Text]: (id, name) => new TextColumn(id, name),
    [EnumColumnType.Number]: (id, name, defaultValue) =>
      new NumberColumn(id, name, Number(defaultValue)),
    [EnumColumnType.YesNo]: (id, name, defaultValue) =>
      new YesNoColumn(id, name, defaultValue),
    [EnumColumnType.Date]: (id, name) => new DateColumn(id, name),
    [EnumColumnType.Choice]: (id, name, defaultValue, choices) =>
      new ChoiceColumn(id, name, choices, defaultValue),
    [EnumColumnType.MultiChoice]: (id, name, defaultValue, choices) =>
      new MultiChoiceColumn(id, name, choices, defaultValue),
    [EnumColumnType.Hyperlink]: (id, name) => new HyperLinkColumn(id, name),
    [EnumColumnType.Person]: (id, name) => new PersonColumn(id, name),
    [EnumColumnType.Currency]: (id, name) => new CurrencyColumn(id, name),
    [EnumColumnType.Location]: (id, name) => new LocationColumn(id, name),
    [EnumColumnType.Image]: (id, name) => new ImageColumn(id, name),
    [EnumColumnType.ManagedMetadata]: (id, name) =>
      new ManagedMetadataColumn(id, name),
    [EnumColumnType.Lookup]: (id, name) => new LookupColumn(id, name),
  };

  static loadColumn(data: any): Column {
    const { id, type, name, defaultValue, choices } = data;
    const column = this.mapColumn[type](id, name, defaultValue, choices);
    return column;
  }

  static createColumn(data: any): Column {
    const { type, name, defaultValue } = data;

    const mapValues = {
      choices: (value: string) =>
        value.split(",").map((choice: string) => choice.trim()),
    };

    const choices = mapValues.choices(data.choices);

    const column = this.mapColumn[type](uuidv4(), name, defaultValue, choices);

    return column;
  }
}

class Row {
  id: string;
  data: { [key: string]: any };

  constructor(id?: string, data?: { [key: string]: any }) {
    this.id = id ?? uuidv4();
    this.data = data ?? {};
  }

  setValue(columnName: string, value: any) {
    this.data[columnName] = value;
  }

  getValue(columnName: string) {
    return this.data[columnName];
  }
}

export { Row, ColumnFactory };
