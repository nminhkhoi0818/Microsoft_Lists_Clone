import {
  ChoiceColumn,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import List from "./List";
import Template from "./Template";

class ListManagement {
  lists: List[];
  templates: Template[];

  constructor() {
    this.lists = [];
    this.templates = [];
  }

  createDefaultTemplates() {
    const template1 = new Template(
      "Template tracker",
      [
        new TextColumn("Full Name"),
        new NumberColumn("Age"),
        new YesNoColumn("Is Active"),
      ],
      "A template for tracking people"
    );

    const template2 = new Template(
      "Task tracker",
      [
        new TextColumn("Task Name"),
        new DateColumn("Due Date"),
        new YesNoColumn("Completed"),
        new ChoiceColumn("Priority", ["High", "Medium", "Low"]),
      ],
      "A template for tracking tasks"
    );

    const template3 = new Template(
      "Project tracker",
      [
        new TextColumn("Project Name"),
        new DateColumn("Start Date"),
        new DateColumn("End Date"),
        new NumberColumn("Budget"),
        new ChoiceColumn("Status", ["Pending", "In Progress", "Completed"]),
      ],
      "A template for tracking projects"
    );

    this.templates.push(template1, template2, template3);
  }

  createList(name: string) {
    let newList = new List(name);
    // Add default column
    newList.addColumn(new TextColumn("Title"));
    this.lists.push(newList);
    return newList;
  }

  createFromTemplate(name: string, templateId: string) {
    let template = this.templates.find(
      (template) => template.id === templateId
    );
    let list = new List(name);
    list.columns = template!.columns;
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

export default ListManagement;
