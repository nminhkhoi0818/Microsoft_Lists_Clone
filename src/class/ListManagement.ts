import { ChoiceColumn, Column, TextColumn } from "./Column";
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
    return list;
  }

  loadTemplates(filePath: string) {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newTemplate = new Template(
        item.name,
        item.description,
        item.columns.map((columnData: any) => {
          return ColumnFactory.createColumn(columnData.type, columnData.name);
        }),
        this.parseRows(item.rows)
      );
      this.templates.push(newTemplate);
    });
  }

  loadLists(filePath: string) {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newList = new List(item.name);
      newList.columns = item.columns.map((columnData: any) => {
        return ColumnFactory.createColumn(columnData.type, columnData.name);
      });
      newList.rows = this.parseRows(item.rows);
      this.lists.push(newList);
    });
  }

  private parseRows(rowsData: any[]) {
    return rowsData.map((rowData: any) => {
      const columns = rowData.columns.map((columnData: any) => {
        let column = ColumnFactory.createColumn(
          columnData.type,
          columnData.name
        );
        column.setValue(columnData.value);
        return column;
      });
      let row = new Row(columns);
      row.columns = columns;
      return row;
    });
  }

  saveLists(filePath: string) {
    const data = {
      lists: this.lists,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  serializeColumn(column: Column) {
    const serialized: any = {
      type: column.type,
      name: column.name,
    };
    if (column instanceof ChoiceColumn) {
      serialized.options = column.options;
    }
    return serialized;
  }

  deleteList(listName: string) {
    this.lists = this.lists.filter((list) => list.name !== listName);
  }

  getList(listName: string) {
    return this.lists.find((list) => list.name === listName);
  }

  getTemplate(templateName: string) {
    return this.templates.find((template) => template.name === templateName);
  }
}

export default ListManagement;
