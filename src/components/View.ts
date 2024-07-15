import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";

class View {
  id: string;
  name: string;
  fields: Column[];

  constructor(name: string, fields: Column[]) {
    this.id = uuidv4();
    this.name = name;
    this.fields = fields;
  }
}

export default View;
