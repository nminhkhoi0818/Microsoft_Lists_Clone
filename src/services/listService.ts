import fs from "fs";
import Template from "../models/Template";
import List from "../models/List";
import { ChoiceColumn, Column, TextColumn } from "../models/Column";
import { ColumnFactory, Row } from "../models/Row";
import path from "path";
import { FILE_PATHS } from "../config/default";

class ListService {
  lists: List[];
  templates: Template[];
  listPath = path.resolve(__dirname, FILE_PATHS.LISTS);
  templatePath = path.resolve(__dirname, FILE_PATHS.TEMPLATES);

  constructor() {
    this.lists = [];
    this.templates = [];
    this.loadTemplates();
    this.loadLists();
  }

  createList(name: string) {
    if (this.lists.find((list) => list.name === name)) {
      throw new Error("List already exists");
    }

    let newList = new List(name);
    newList.addColumn(new TextColumn("Title"));
    this.lists.push(newList);

    this.saveLists(this.listPath);
    return newList;
  }

  createFromTemplate(name: string, templateId: string) {
    let template = this.templates.find(
      (template) => template.id === templateId
    );
    let list = new List(name);
    list.columns = template!.columns;
    this.lists.push(list);

    this.saveLists(this.listPath);
    return list;
  }

  loadTemplates() {
    const jsonData = fs.readFileSync(this.templatePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newTemplate = new Template(
        item.name,
        item.description,
        item.columns.map((columnData: any) => {
          return ColumnFactory.loadColumn(
            columnData.id,
            columnData.type,
            columnData.name
          );
        }),
        this.parseRows(item.rows)
      );
      this.templates.push(newTemplate);
    });
  }

  loadLists() {
    const jsonData = fs.readFileSync(this.listPath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newList = new List(item.name, item.id);
      newList.columns = item.columns.map((columnData: any) => {
        return ColumnFactory.loadColumn(
          columnData.id,
          columnData.type,
          columnData.name
        );
      });
      newList.rows = this.parseRows(item.rows);
      this.lists.push(newList);
    });
  }

  parseRows(rowsData: any[]) {
    return rowsData.map((rowData: any) => {
      const columns = rowData.columns.map((columnData: any) => {
        let column = ColumnFactory.loadColumn(
          columnData.id,
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

  deleteList(listId: string) {
    if (!this.lists.find((list) => list.id === listId)) {
      throw new Error("List not found");
    }

    this.lists = this.lists.filter((list) => list.id !== listId);
    this.saveLists(this.listPath);
  }

  getList(listName: string) {
    return this.lists.find((list) => list.name === listName);
  }

  getTemplate(templateName: string) {
    return this.templates.find((template) => template.name === templateName);
  }

  addColumn(listId: string, name: string, type: string) {
    const list = this.lists.find((list) => list.id === listId);
    if (list) {
      const column = ColumnFactory.createColumn(type, name);
      list.addColumn(column);
      this.saveLists(this.listPath);
    } else {
      throw new Error("List not found");
    }
  }

  addRow(listId: string, data: any) {
    const list = this.lists.find((list) => list.id === listId);
    if (!list) throw new Error("List not found");

    const row: Row = new Row(list.columns);

    data.forEach((colData) => {
      Object.keys(colData).forEach((colName) => {
        row.setValueCol(colName, colData[colName]);
      });
    });
    list.rows.push(row);
    this.saveLists(this.listPath);
  }
}

export default ListService;
