import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import Form from "./Form";
import { View } from "./View";
import { Row } from "./Row";

class List {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  views: View[];
  forms: Form[];

  constructor(name: string, id?: string) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.columns = [];
    this.rows = [];
    this.views = [];
    this.forms = [];
  }

  addColumn(column: Column) {
    this.columns.push(column);
  }

  getColumn(colName: string) {
    return this.columns.find((col) => col.name === colName);
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

  getPage(pageNum: number, pageSize: number) {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return this.rows.slice(start, end);
  }

  getPageCount(pageSize: number) {
    return Math.ceil(this.rows.length / pageSize);
  }

  hideColumn(colName: string) {
    const col = this.getColumn(colName);
    col!.isHidden = true;
  }

  addView(view: View) {
    view.columns = this.columns;
    view.rows = this.rows;
    this.views.push(view);
    return view;
  }

  getViews(viewName: string) {
    return this.views.filter((view) => view.name === viewName);
  }

  createForm(name: string) {
    const form = new Form(name, this.columns, this.rows);
    this.forms.push(form);
    return form;
  }

  getForm(formName: string) {
    return this.forms.find((form) => form.title === formName);
  }
}

export default List;
