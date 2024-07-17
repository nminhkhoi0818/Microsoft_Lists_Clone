import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import Form from "./Form";
import Row from "./Row";
import { View } from "./View";

class List {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  views: View[];
  forms: Form[];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.columns = [];
    this.rows = [];
    this.views = [];
    this.forms = [];
  }

  addColumn(column: Column) {
    this.columns.push(column);

    this.rows.forEach((row) => {
      row.addColumn(column);
    });
  }

  addRow(...data: any[]) {
    const row: Row = new Row(this.columns);

    data.forEach((value, index) => {
      row.columns[index].setValue(value);
    });

    this.rows.push(row);
  }

  getRow(index: number) {
    if (index < 0 || index >= this.rows.length) {
      throw new Error("Index out of bounds");
    }
    return this.rows[index];
  }

  deleteRow(rowId: string) {
    this.rows = this.rows.filter((row) => row.id !== rowId);
  }

  deleteColumn(colName: string) {
    this.columns = this.columns.filter((col) => col.name !== colName);

    this.rows.forEach((row) => {
      row.columns = row.columns.filter((col) => col.name !== colName);
    });
  }

  addView(name: string, view: View) {
    view.name = name;
    this.views.push(view);
  }

  createForm(name: string) {
    const form = new Form(name, this.columns);
    this.forms.push(form);
    return form;
  }
}

export default List;
