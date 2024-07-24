import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import { Row } from "./Row";

class Template {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  summary: string;

  constructor(name: string, summary: string, columns: Column[], rows: Row[]) {
    this.id = uuidv4();
    this.name = name;
    this.summary = summary;
    this.columns = columns;
    this.rows = rows;
  }
}

export default Template;
