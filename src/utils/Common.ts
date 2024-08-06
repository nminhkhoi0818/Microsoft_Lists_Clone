import { FieldPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { Column } from "../models/Column";
import List from "../models/List";
import { ColumnFactory } from "../models/Row";

class Common {
  static async ensureListDoesNotExist(name: string) {
    const connection = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT * FROM lists WHERE name = ?",
      [name]
    );

    if (rows.length > 0) {
      throw new Error("List already exists");
    }
  }

  static ensureListExists(lists: List[], listId: string): void {
    if (!lists.find((list) => list.id === listId)) {
      throw new Error("List not found");
    }
  }

  static async ensureColumnDoesNotExist(listId: string, name: string) {
    const connection = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ? AND name = ?",
      [listId, name]
    );

    if (rows.length > 0) {
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

  static async getColumnByName(listId: string, columnName: string) {
    const connection = await connect();
    const [rows] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ? AND name = ?",
      [listId, columnName]
    );

    return ColumnFactory.loadColumn(rows[0]);
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

  static configHandlers: { [key: string]: (value: string) => any } = {
    choices: (value: string) =>
      value.split(",").map((choice: string) => choice.trim().replace(/"/g, "")),
    maxLength: (value: string) => Number(value),
    defaultValue: (value: string) => value,
  };

  static checkValidConfig(config: any) {
    config.forEach((item: any) => {
      const { config_name } = item;
      if (!Common.configHandlers[config_name]) {
        throw new Error("Invalid config");
      }
    });
  }
}

export default Common;
