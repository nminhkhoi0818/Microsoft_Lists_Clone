import fs from "fs";
import List from "../models/List";
import { ChoiceColumn, TextColumn } from "../models/Column";
import { ColumnFactory, Row } from "../models/Row";
import path from "path";
import { FILE_PATHS } from "../config/default";
import { EnumColumnType } from "../models/Enum";
import TemplateService from "./templateService";

class ListService {
  lists: List[];
  listPath = path.resolve(__dirname, FILE_PATHS.LISTS);
  templatePath = path.resolve(__dirname, FILE_PATHS.TEMPLATES);

  constructor() {
    this.lists = [];
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
    let templateService = new TemplateService();
    const template = templateService.templates.find(
      (template) => template.id === templateId
    );

    let list = new List(name);
    list.columns = template!.columns;
    this.lists.push(list);

    this.saveLists(this.listPath);
    return list;
  }

  loadLists() {
    const jsonData = fs.readFileSync(this.listPath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newList = new List(item.name, item.id);
      newList.columns = item.columns.map((columnData: any) => {
        return ColumnFactory.loadColumn(columnData);
      });
      newList.rows = this.parseRows(item.rows);
      this.lists.push(newList);
    });
  }

  parseRows(rowsData: any[]) {
    return rowsData.map((rowData: any) => {
      const columns = rowData.columns.map((columnData: any) => {
        let column = ColumnFactory.loadColumn(columnData);
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

  updateList(listId: string, name: string) {
    const list = this.lists.find((list) => list.id === listId);
    if (!list) {
      throw new Error("List not found");
    }

    list.name = name;
    this.saveLists(this.listPath);
  }

  deleteList(listId: string) {
    if (!this.lists.find((list) => list.id === listId)) {
      throw new Error("List not found");
    }

    this.lists = this.lists.filter((list) => list.id !== listId);
    this.saveLists(this.listPath);
  }

  getListById(listId: string) {
    const list = this.lists.find((list) => list.id === listId);
    if (!list) throw new Error("List not found");
    return list;
  }

  addColumn(listId: string, data: any) {
    const list = this.getListById(listId);

    const { name } = data;
    if (list.columns.find((col) => col.name === name)) {
      throw new Error("Column already exists");
    }

    const column = ColumnFactory.createColumn(data);
    list.addColumn(column);
    this.saveLists(this.listPath);
  }

  updateColumn(listId: string, columnId: string, name: string, type: string) {
    const list = this.getListById(listId);
    const column = list.columns.find((col) => col.id === columnId);
    if (!column) {
      throw new Error("Column not found");
    }

    column.name = name;
    // column.type = type;
    this.saveLists(this.listPath);
  }

  deleteColumn(listId: string, columnId: string) {
    const list = this.getListById(listId);
    const column = list.columns.find((col) => col.id === columnId);

    list.columns = list.columns.filter((col) => col.id !== columnId);
    list.rows.forEach((row) => {
      row.columns = row.columns.filter((col) => col.name !== column?.name);
    });

    this.saveLists(this.listPath);
  }

  addRow(listId: string, data: any) {
    const list = this.getListById(listId);
    const row: Row = new Row(list.columns);

    data.forEach((colData) => {
      Object.keys(colData).forEach((colName) => {
        row.setValueCol(colName, colData[colName]);
      });
    });
    list.rows.push(row);
    this.saveLists(this.listPath);
  }

  updateRow(listId: string, rowId: string, data: any) {
    const list = this.getListById(listId);
    const row = list.rows.find((row) => row.id === rowId);
    if (!row) {
      throw new Error("Row not found");
    }

    data.forEach((colData) => {
      Object.keys(colData).forEach((colName) => {
        row.setValueCol(colName, colData[colName]);
      });
    });

    this.saveLists(this.listPath);
  }

  deleteRow(listId: string, rowId: string) {
    const list = this.getListById(listId);
    list.rows = list.rows.filter((row) => row.id !== rowId);
    this.saveLists(this.listPath);
  }

  addOption(listId: string, columnId: string, option: string) {
    const list = this.getListById(listId);
    const column = list.columns.find(
      (col) => col.id === columnId
    ) as ChoiceColumn;

    if (!column) {
      throw new Error("Column not found");
    }

    if (column.type !== EnumColumnType.Choice) {
      throw new Error("Column is not a choice type");
    }

    column.addOption(option);
    this.saveLists(this.listPath);
  }

  getList(
    listId: string,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) {
    const list = this.getListById(listId);
    let rows = [...list.rows];

    if (search) {
      rows = list.rows.filter((row) => {
        return row.columns.some((col) => {
          return col.getValue().toString().includes(search);
        });
      });
    }

    if (sort) {
      const column = list.getColumn(sort);
      if (!column) {
        throw new Error("Column not found");
      }
      rows = rows.sort((a, b) => {
        return a.getValueCol(sort) < b.getValueCol(sort) ? 1 : -1;
      });
    }

    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedRows = rows.slice(start, end);

    return { ...list, rows: paginatedRows };
  }
}
export default ListService;
