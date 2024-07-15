import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";

class Form {
  id: string;
  title: string;
  fields: Column[];

  constructor(title: string, fields: Column[]) {
    this.id = uuidv4();
    this.title = title;
    this.fields = fields;
  }

  addField(field: Column) {
    this.fields.push(field);
  }

  deleteField(columnId: string) {
    this.fields = this.fields.filter((field) => field.id !== columnId);
  }
}

export default Form;
