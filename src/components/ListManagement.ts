import {
  ChoiceColumn,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./Column";
import List from "./List";
import Template from "./Template";
import fs from "fs";

class ListManagement {
  lists: List[];
  templates: Template[];

  constructor() {
    this.lists = [];
    this.templates = [];
  }

  loadTemplates(filePath: string) {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.templates.forEach((template: any) => {
      const columns = template.columns.map((columnData: any) => {
        switch (columnData.type) {
          case "TextColumn":
            return new TextColumn(columnData.name);
          case "NumberColumn":
            return new NumberColumn(columnData.name);
          case "YesNoColumn":
            return new YesNoColumn(columnData.name);
          case "DateColumn":
            return new DateColumn(columnData.name);
          case "ChoiceColumn":
            return new ChoiceColumn(columnData.name, columnData.choices);
          default:
            throw new Error(`Unknown column type: ${columnData.type}`);
        }
      });
      const newTemplate = new Template(
        template.name,
        columns,
        template.summary
      );
      this.templates.push(newTemplate);
    });
  }

  createList(name: string) {
    const existingList = this.lists.find((list) => list.name === name);
    if (existingList) {
      throw new Error("List with the same name already exists");
    }

    let newList = new List(name);
    // Add default column
    newList.addColumn(new TextColumn("Title"));
    this.lists.push(newList);
    return newList;
  }

  createFromTemplate(name: string, templateId: string) {
    const existingList = this.lists.find((list) => list.name === name);
    if (existingList) {
      throw new Error("List with the same name already exists");
    }

    let template = this.templates.find(
      (template) => template.id === templateId
    );
    let list = new List(name);
    list.columns = template!.columns;
    this.lists.push(list);
    return list;
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
