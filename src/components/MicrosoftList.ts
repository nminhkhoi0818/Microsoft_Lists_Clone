import { TextColumn } from "./Column";
import List from "./List";
import Template from "./Template";

class MicrosoftList {
  lists: List[];
  templates: Template[];

  constructor() {
    this.lists = [];
    this.templates = [];
    this.initTemplate();
  }

  createList(name: string) {
    let newList = new List(name);
    this.lists.push(new List(name));
    return newList;
  }

  initTemplate() {
    let list = new List("");
    list.addColumn(new TextColumn("Issue"));
    list.addColumn(new TextColumn("Issue description"));
    let template = new Template(
      "Issue tracker",
      list,
      "Track issues and bring them to closure in this list."
    );
    this.templates.push(template);
  }

  createFromTemplate(name: string, templateId: string) {
    let template = this.templates.find(
      (template) => template.id === templateId
    );
    let list = new List(name);
    list.columns = template!.list.columns;
    this.lists.push(list);
  }

  deleteList(listId: string) {
    this.lists = this.lists.filter((list) => list.id !== listId);
  }

  getListById(listId: string) {
    return this.lists.find((list) => list.id === listId);
  }

  getTemplateById(templateId: string) {
    return this.templates.find((template) => template.id === templateId);
  }
}

export default MicrosoftList;
