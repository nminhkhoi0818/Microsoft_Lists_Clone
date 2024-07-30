import fs from "fs";
import List from "../models/List";
import { ChoiceColumn, TextColumn } from "../models/Column";
import { ColumnFactory, Row } from "../models/Row";
import path from "path";
import { DEFAULT_COLUMNS, FILE_PATHS } from "../config/default";
import { EnumColumnType } from "../models/Enum";
import Template from "../models/Template";

class ListService {
  lists: List[] = [];
  templates: Template[] = [];
  listPath: string = path.resolve(__dirname, FILE_PATHS.LISTS);
  templatePath: string = path.resolve(__dirname, FILE_PATHS.TEMPLATES);

  createList(name: string) {
    this.loadLists(this.listPath);
    this.ensureListDoesNotExist(name);

    let newList = new List(name);
    newList.addColumn(new TextColumn(DEFAULT_COLUMNS.NAME));
    this.lists.push(newList);

    this.saveLists(this.listPath);
    return newList;
  }

  createFromTemplate(name: string, templateId: string) {
    this.loadTemplates(this.templatePath);
    const template = this.templates.find(
      (template) => template.id === templateId
    );

    this.loadLists(this.listPath);
    this.ensureListDoesNotExist(name);

    let list = new List(name);
    list.columns = template!.columns;
    this.lists.push(list);

    this.saveLists(this.listPath);
    return list;
  }

  loadLists(filePath: string) {
    try {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(jsonData);

      this.lists = data.lists.map((item: any) => {
        const list = new List(item.name, item.id);
        list.columns = item.columns.map((columnData: any) => {
          return ColumnFactory.loadColumn(columnData);
        });
        list.rows = this.parseRows(item.rows);
        return list;
      });
    } catch (error) {
      console.log("Error loading lists", error);
    }
  }

  loadTemplates(filePath: string) {
    try {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(jsonData);

      data.templates.forEach((item: any) => {
        const newTemplate = new Template(
          item.name,
          item.columns.map((columnData: any) => {
            return ColumnFactory.loadColumn(columnData);
          }),
          this.parseRows(item.rows),
          item.id
        );
        this.templates.push(newTemplate);
      });
    } catch (error) {
      console.log("Error loading templates", error);
    }
  }

  parseRows(rowsData: any[]) {
    return rowsData.map((item: any) => {
      const columns = item.columns.map((columnData: any) => {
        let column = ColumnFactory.loadColumn(columnData);
        column.setValue(columnData.value);
        return column;
      });
      let row = new Row(columns, item.id);
      return row;
    });
  }

  saveLists(filePath: string) {
    const data = {
      lists: this.lists,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  getAllLists() {
    this.loadLists(this.listPath);
    return this.lists;
  }

  getAllTemplates() {
    this.loadTemplates(this.listPath);
    return this.templates;
  }

  updateList(listId: string, name: string) {
    const list = this.lists.find((list) => list.id === listId);
    this.ensureListExists(listId);

    list!.name = name;
    this.saveLists(this.listPath);
  }

  deleteList(listId: string) {
    this.loadLists(this.listPath);
    this.ensureListExists(listId);

    this.lists = this.lists.filter((list) => list.id !== listId);
    this.saveLists(this.listPath);
  }

  getListById(listId: string) {
    this.loadLists(this.listPath);
    const list = this.lists.find((list) => list.id === listId);
    if (!list) throw new Error("List not found");

    return list;
  }

  addColumn(listId: string, data: any) {
    this.loadLists(this.listPath);
    const list = this.getListById(listId);

    const { name } = data;
    this.ensureColumnDoesNotExist(listId, name);

    const column = ColumnFactory.createColumn(data);
    list.addColumn(column);
    this.saveLists(this.listPath);
  }

  updateColumn(
    listId: string,
    columnId: string,
    name: string,
    type: EnumColumnType
  ) {
    this.loadLists(path.resolve(__dirname, FILE_PATHS.LISTS));
    const list = this.getListById(listId);
    const column = list.columns.find((col) => col.id === columnId);
    if (!column) {
      throw new Error("Column not found");
    }

    list.rows.forEach((row) => {
      const col = row.columns.find((col) => col.name === column?.name);
      col!.name = name;
      col!.type = type;
    });

    column.name = name;
    column.type = type;
    this.saveLists(path.resolve(__dirname, FILE_PATHS.LISTS));
  }

  deleteColumn(listId: string, columnId: string) {
    this.loadLists(this.listPath);

    const list = this.getListById(listId);
    const column = list.columns.find((col) => col.id === columnId);

    list.columns = list.columns.filter((col) => col.id !== columnId);
    list.rows.forEach((row) => {
      row.columns = row.columns.filter((col) => col.name !== column?.name);
    });

    this.saveLists(this.listPath);
  }

  addRow(listId: string, data: any) {
    this.loadLists(this.listPath);

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
    this.loadLists(this.listPath);

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
    this.loadLists(this.listPath);

    const list = this.getListById(listId);
    list.rows = list.rows.filter((row) => row.id !== rowId);

    this.saveLists(this.listPath);
  }

  addOption(listId: string, columnId: string, option: string) {
    this.loadLists(this.listPath);
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

  getRows(
    listId: string,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ) {
    this.loadLists(this.listPath);
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

    return this.paginateRows(rows, page, pageSize);
  }

  filterRows(
    listId: string,
    column: string,
    value: string[],
    page: number,
    pageSize: number
  ) {
    this.loadLists(this.listPath);
    const list = this.getListById(listId);

    let rows = [...list.rows];
    rows = rows.filter((row) => {
      return value.includes(row.getValueCol(column));
    });

    return this.paginateRows(rows, page, pageSize);
  }

  paginateRows(rows: Row[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }

  ensureListDoesNotExist(name: string) {
    if (this.lists.find((list) => list.name === name)) {
      throw new Error("List already exists");
    }
  }

  ensureListExists(listId: string) {
    if (!this.lists.find((list) => list.id === listId)) {
      throw new Error("List not found");
    }
  }

  ensureColumnDoesNotExist(listId: string, name: string) {
    const list = this.getListById(listId);
    if (list.columns.find((col) => col.name === name)) {
      throw new Error("Column already exists");
    }
  }
}

export default ListService;
