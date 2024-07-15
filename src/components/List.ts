import { v4 as uuidv4 } from "uuid";
import Item from "./Item";
import View from "./View";
import { Column, TextColumn } from "./Column";
import Form from "./Form";

class List {
  id: string;
  name: string;
  columns: Column[];
  items: Item[];
  views: View[];
  forms: Form[];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.columns = [];
    this.items = [];
    this.views = [];
    this.forms = [];
  }

  addColumn(Column: Column) {
    this.columns.push(Column);
  }

  addItem(...data: any[]) {
    const item = new Item(this.columns);
    data.forEach((value, index) => {
      item.columns[index].setValue(value);
    });
    this.items.push(item);
  }

  deleteItem(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  createView(name: string) {
    let view = new View(name, this.columns);
    this.views.push(view);
  }

  deleteView(viewId: string) {
    this.views = this.views.filter((view) => view.id !== viewId);
  }

  createForm(name: string) {
    let form = new Form(name, this.columns);
    this.forms.push(form);
  }

  deleteForm(formId: string) {
    this.forms = this.forms.filter((form) => form.id !== formId);
  }
}

export default List;
