import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";

class Item {
  id: string;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = uuidv4();
    this.columns = columns;
  }
}

export default Item;
