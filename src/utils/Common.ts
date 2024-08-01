import { Column } from "../models/Column";
import List from "../models/List";

class Common {
  static ensureListDoesNotExist(lists: List[], name: string): void {
    if (lists.find((list) => list.name === name)) {
      throw new Error("List already exists");
    }
  }

  static ensureListExists(lists: List[], listId: string): void {
    if (!lists.find((list) => list.id === listId)) {
      throw new Error("List not found");
    }
  }

  static ensureColumnDoesNotExist(list: List, name: string) {
    if (list.columns.find((col) => col.name === name)) {
      throw new Error("Column already exists");
    }
  }

  static ensureColumnExists(list: List, name: string) {
    if (!list.columns.find((col) => col.name === name)) {
      throw new Error("Column not found");
    }
  }

  static getListById(lists: List[], listId: string) {
    const list = lists.find((list) => list.id === listId);
    if (!list) throw new Error("List not found");

    return list;
  }

  static getColumnById(list: List, columnId: string) {
    const column = list.columns.find((col) => col.id === columnId);
    if (!column) throw new Error("Column not found");

    return column;
  }

  static getColumnByName(list: List, columnName: string) {
    const column = list.columns.find((col) => col.name === columnName);
    if (!column) throw new Error("Column not found");

    return column;
  }

  static getRowById(list: List, rowId: string) {
    const row = list.rows.find((row) => row.id === rowId);
    if (!row) throw new Error("Row not found");

    return row;
  }

  static getColumnIndex(list: List, columnId: string) {
    const colIdx = list.columns.findIndex((col) => col.id === columnId);
    if (colIdx === -1) throw new Error("Column not found");

    return colIdx;
  }

  static validateRowData(column: Column, data: any) {
    if (!column.validate(data)) {
      throw new Error("Invalid value");
    }
  }
}

export default Common;
