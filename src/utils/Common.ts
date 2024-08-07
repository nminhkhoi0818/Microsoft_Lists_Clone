import { FieldPacket, RowDataPacket } from "mysql2";
import { connect } from "../db";
import { ColumnFactory } from "../models/Row";
import { EnumColumnType } from "../models/Enum";

class Common {
  static async ensureListDoesNotExist(name: string) {
    const connection = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT * FROM lists WHERE name = ?",
      [name]
    );

    if (rows.length > 0) {
      connection.end();
      throw new Error("List already exists");
    }
  }

  static async ensureColumnExist(listId: string, columnId: string) {
    const connection = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ? AND id = ?",
      [listId, columnId]
    );

    if (rows.length === 0) {
      throw new Error("Column not found");
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

  static async getColumnByName(listId: string, columnName: string) {
    const connection = await connect();
    const [rows] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ? AND name = ?",
      [listId, columnName]
    );

    return ColumnFactory.loadColumn(rows[0]);
  }

  static configHandlers: { [key: string]: (value: string) => any } = {
    choices: (value: string) =>
      value.split(",").map((choice: string) => choice.trim().replace(/"/g, "")),
    maxLength: (value: string) => Number(value),
    defaultValue: (value: string) => value
  };

  static checkValidConfig(config_name: string) {
    if (!Common.configHandlers[config_name]) {
      throw new Error("Invalid config name");
    }
  }

  static checkValidType(type: string) {
    if (EnumColumnType[type as keyof typeof EnumColumnType] === undefined) {
      throw new Error("Invalid column type");
    }
  }
}

export default Common;
