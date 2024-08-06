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
}

export default List;
