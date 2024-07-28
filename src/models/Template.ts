import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import { Row } from "./Row";

class Template {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];

  constructor(name: string, columns: Column[], rows: Row[]) {
    this.id = uuidv4();
    this.name = name;
    this.columns = columns;
    this.rows = rows;
  }
}

export default Template;
