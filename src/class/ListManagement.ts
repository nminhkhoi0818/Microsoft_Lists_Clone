import { TextColumn } from "./Column";
import List from "./List";
import { ColumnFactory, Row } from "./Row";
import Template from "./Template";
import fs from "fs";

class ListManagement {
  lists: List[];
  templates: Template[];

  constructor() {
    this.lists = [];
    this.templates = [];
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

  loadTemplates(filePath: string) {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.templates.forEach((template: any) => {
      const columns = template.columns.map((columnData: any) => {
        return ColumnFactory.createColumn(columnData.type, columnData.name);
      });

      const newTemplate = new Template(
        template.name,
        columns,
        template.description
      );
      this.templates.push(newTemplate);
    });
  }

  saveLists(filePath: string) {
    const data = {
      lists: this.lists,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  loadLists(filePath: string) {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((list: any) => {
      const newList = new List(list.name);
      newList.columns = list.columns.map((columnData: any) => {
        return ColumnFactory.createColumn(columnData.type, columnData.name);
      });
      newList.rows = list.rows.map((rowData: any) => {
        rowData.columns = rowData.columns.map((columnData: any) => {
          let column = ColumnFactory.createColumn(
            columnData.type,
            columnData.name
          );
          column.setValue(columnData.value);
          return column;
        });

        let row = new Row(rowData.columns);
        row.columns = rowData.columns;
        return row;
      });
      this.lists.push(newList);
    });
  }

  deleteList(listId: string) {
    this.lists = this.lists.filter((list) => list.id !== listId);
  }

  getList(listName: string) {
    return this.lists.find((list) => list.name === listName);
  }

  getTemplate(templateName: string) {
    return this.templates.find((template) => template.name === templateName);
  }
}

export default ListManagement;