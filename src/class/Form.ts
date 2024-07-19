import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";

class Form {
  id: string;
  title: string;
  columns: Column[];

  constructor(title: string, columns: Column[]) {
    this.id = uuidv4();
    this.title = title;
    this.columns = columns;
  }

  addColumn(column: Column) {
    if (this.columns.find((field) => field.name === column.name)) {
      throw new Error("Column name already exists");
    }
    this.columns.push(column);
  }

  hideColumn(colName: string) {
    this.columns = this.columns.filter((field) => field.name !== colName);
  }
}

export default Form;
