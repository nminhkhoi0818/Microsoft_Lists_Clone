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
}

export default Form;
