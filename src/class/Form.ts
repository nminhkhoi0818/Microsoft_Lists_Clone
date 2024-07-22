import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import { Row } from "./Row";

class Form {
  id: string;
  title: string;
  columns: Column[];
  rows: Row[];

  constructor(title: string, columns: Column[], rows: Row[]) {
    this.id = uuidv4();
    this.title = title;
    this.columns = columns;
    this.rows = rows;
  }

  addColumn(column: Column) {
    if (this.columns.find((field) => field.name === column.name)) {
      throw new Error("Column name already exists");
    }
    this.columns.push(column);
  }

  hideColumn(colName: string) {
    let column = this.columns.find((field) => field.name === colName);
    column!.isHidden = true;
  }

  submit(data: any) {
    const row: Row = new Row(this.columns);

    Object.keys(data).forEach((colName) => {
      row.setValueCol(colName, data[colName]);
    });
    this.rows.push(row);
  }
}

export default Form;
