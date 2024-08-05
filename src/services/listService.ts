import fs from "fs";
import List from "../models/List";
import { ChoiceColumn, MultiChoiceColumn, TextColumn } from "../models/Column";
import { ColumnFactory, Row } from "../models/Row";
import path from "path";
import { DEFAULT_COLUMNS, FILE_PATHS } from "../config/default";
import { EnumColumnType } from "../models/Enum";
import Template from "../models/Template";
import Common from "../utils/Common";

class ListService {
  lists: List[] = [];
  templates: Template[] = [];
  listPath: string = path.resolve(__dirname, FILE_PATHS.LISTS);
  templatePath: string = path.resolve(__dirname, FILE_PATHS.TEMPLATES);

  createList(name: string) {
    this.loadLists(this.listPath);
    Common.ensureListDoesNotExist(this.lists, name);

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
    Common.ensureListDoesNotExist(this.lists, name);

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
        list.rows = item.rows.map((row: any) => {
          return new Row(row.id, row.data);
        });
        return list;
      });
    } catch (error) {
      throw new Error("Error loading lists");
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
          item.rows.map((row: any) => {
            return new Row(row.id, row.data);
          }),
          item.id
        );
        this.templates.push(newTemplate);
      });
    } catch (error) {
      throw new Error("Error loading templates");
    }
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
    this.loadTemplates(this.templatePath);
    return this.templates;
  }

  getListById(listId: string) {
    this.loadLists(this.listPath);
    return Common.getListById(this.lists, listId);
  }

  deleteList(listId: string) {
    this.loadLists(this.listPath);
    Common.ensureListExists(this.lists, listId);

    this.lists = this.lists.filter((list) => list.id !== listId);
    this.saveLists(this.listPath);
  }

  addColumn(listId: string, data: any) {
    this.loadLists(this.listPath);
    const list = Common.getListById(this.lists, listId);

    const { name } = data;
    Common.ensureColumnDoesNotExist(list, name);

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
    const list = Common.getListById(this.lists, listId);
    const column = Common.getColumnById(list, columnId);

    column.name = name;
    column.type = type;
    this.saveLists(path.resolve(__dirname, FILE_PATHS.LISTS));
  }

  deleteColumn(listId: string, columnId: string) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);

    list.columns = list.columns.filter((col) => col.id !== columnId);
    const column = Common.getColumnById(list, columnId);

    list.rows.forEach((row) => {
      delete row.data[column.name];
    });

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

    const list = Common.getListById(this.lists, listId);
    let rows = [...list.rows];

    if (search) {
      rows = list.rows.filter((row) => {
        return Object.values(row.data).some((value) => {
          return value.toString().toLowerCase().includes(search.toLowerCase());
        });
      });
    }

    if (sort) {
      Common.ensureColumnExists(list, sort);
      rows.sort((a, b) => {
        const columnA = a.data[sort];
        const columnB = b.data[sort];

        return columnA > columnB ? 1 : -1;
      });
    }

    return this.paginateRows(rows, page, pageSize);
  }

  addRow(listId: string, formValues: any) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);
    let row = new Row();

    formValues.forEach((item: any) => {
      const { FieldName, FieldValue } = item;

      const column = Common.getColumnByName(list, FieldName);
      Common.validateRowData(column, FieldValue);

      row.setValue(column.name, column.mapDataCol(FieldValue));
    });

    list.rows.push(row);
    this.saveLists(this.listPath);
  }

  deleteRow(listId: string, rowId: string) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);
    list.rows = list.rows.filter((row) => row.id !== rowId);

    this.saveLists(this.listPath);
  }

  updateCellData(listId: string, rowId: string, data: any) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);
    const row = Common.getRowById(list, rowId);

    const { FieldName, FieldValue } = data;
    const column = Common.getColumnByName(list, FieldName);
    Common.validateRowData(column, FieldValue);

    row.setValue(column.name, column.mapDataCol(FieldValue));

    this.saveLists(this.listPath);
  }

  filterRows(
    listId: string,
    column: string,
    value: string[],
    page: number,
    pageSize: number
  ) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);

    let rows = [...list.rows];
    rows = rows.filter((row) => {
      return value.includes(row.data[column]);
    });

    return this.paginateRows(rows, page, pageSize);
  }

  paginateRows(rows: Row[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }

  addChoice(listId: string, columnId: string, option: string) {
    this.loadLists(this.listPath);

    const list = Common.getListById(this.lists, listId);
    const column = Common.getColumnById(list, columnId) as
      | ChoiceColumn
      | MultiChoiceColumn;

    column.addChoice(option);
    this.saveLists(this.listPath);
  }
}

export default ListService;
