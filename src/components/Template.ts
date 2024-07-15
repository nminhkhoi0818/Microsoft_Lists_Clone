import { v4 as uuidv4 } from "uuid";
import List from "./List";
import { Column } from "./Column";

class Template {
  id: string;
  name: string;
  columns: Column[];
  summary: string;

  constructor(name: string, columns: Column[], summary: string) {
    this.id = uuidv4();
    this.name = name;
    this.columns = columns;
    this.summary = summary;
  }
}

export default Template;
