import { ChoiceColumn, Column, TextColumn } from "./Column";
import List from "./List";
import { ColumnFactory, Row } from "./Row";
import Template from "./Template";
import fs from "fs";
import { Organization, User } from "./User";

class ListManagement {
  lists: List[];
  templates: Template[];
  users: User[];
  organizations: Organization[];

  constructor() {
    this.lists = [];
    this.templates = [];
    this.users = [];
    this.organizations = [];
  }

  createList(name: string, user: User): List {
    const list = user.createList(name);
    return list;
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
      lists: this.lists.map((list) => {
        return {
          name: list.name,
          columns: list.columns.map((column) => {
            return this.serializeColumn(column);
          }),
          rows: list.rows.map((row) => {
            return {
              columns: row.columns.map((column) => {
                return {
                  type: column.type,
                  name: column.name,
                  value: column.getValue(),
                };
              }),
            };
          }),
        };
      }),
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

  addUser(user: User) {
    this.users.push(user);
    return user;
  }

  addOrg(org: Organization) {
    this.organizations.push(org);
    return org;
  }
}

export default ListManagement;
