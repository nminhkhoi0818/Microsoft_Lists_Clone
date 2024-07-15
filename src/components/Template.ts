import { v4 as uuidv4 } from "uuid";
import List from "./List";

class Template {
  id: string;
  name: string;
  list: List;
  summary: string;

  constructor(name: string, list: List, summary: string) {
    this.id = uuidv4();
    this.name = name;
    this.list = list;
    this.summary = summary;
  }
}

export default Template;
