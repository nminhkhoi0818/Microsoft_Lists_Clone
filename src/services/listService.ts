import List from "../models/List";
import { ColumnFactory, Row } from "../models/Row";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { EnumColumnType } from "../models/Enum";
import Common from "../utils/Common";
import { connect } from "../db";

class ListService {
  async getAllLists() {
    const connection = await connect();
    const [rows] = await connection.execute("SELECT * FROM lists");
    await connection.end();
    return rows;
  }

  async createList(name: string) {
    const connection = await connect();

    Common.ensureListDoesNotExist(name);

    await connection.execute(
      "INSERT INTO lists (id, name) VALUES (UUID(), ?)",
      [name]
    );
    await connection.end();
  }

  async getListById(listId: string) {
    const connection = await connect();
    const [rows] = await connection.execute(
      "SELECT * FROM lists WHERE id = ?",
      [listId]
    );

    return new List(rows[0].name, rows[0].id);
  }

  async deleteList(listId: string) {
    const connection = await connect();

    await connection.execute("DELETE FROM lists WHERE id = ?", [listId]);
    await connection.execute("DELETE FROM columns WHERE listId = ?", [listId]);
    await connection.execute("DELETE FROM _rows WHERE listId = ?", [listId]);
  }

  async getColumns(listId: string) {
    const connection = await connect();

    const [rows]: [any[], any] = await connection.execute(
      `SELECT c.id AS columnId, c.name, c.type, cs.config_name, cs.config_value
       FROM columns c
       LEFT JOIN columns_settings cs ON c.id = cs.columnId
       WHERE c.listId = ?`,
      [listId]
    );

    const columns = rows.map((row: any) => {
      const baseColumn = {
        columnId: row.columnId,
        name: row.name,
        type: row.type,
      };

      const handleConfig = Common.configHandlers[row.config_name];
      return handleConfig
        ? { ...baseColumn, [row.config_name]: handleConfig(row.config_value) }
        : baseColumn;
    });

    return columns;
  }

  async addColumn(listId: string, data: any) {
    const connection = await connect();

    const { config } = data;

    const column = ColumnFactory.createColumn(data);

    await connection.execute(
      "INSERT INTO columns (id, name, type, listId) VALUES (?, ?, ?, ?)",
      [column.id, column.name, column.type, listId]
    );

    for (const item of config) {
      const { config_name, config_value } = item;

      Common.checkValidConfig([item]);

      await connection.execute(
        "INSERT INTO columns_settings(id, columnId, config_name, config_value) VALUES(UUID(), ?, ?, ?)",
        [column.id, config_name, config_value]
      );
    }
  }

  async updateColumn(
    listId: string,
    columnId: string,
    name: string,
    type: EnumColumnType
  ) {
    const connection = await connect();

    const list = await this.getListById(listId);

    const column = Common.getColumnById(list, columnId);
    column.name = name;
    column.type = type;

    await connection.execute(
      "UPDATE columns SET name = ?, type = ? WHERE id = ?",
      [name, type, columnId]
    );
  }

  async deleteColumn(listId: string, columnId: string) {
    const connection = await connect();

    await connection.execute(
      "DELETE FROM columns WHERE id = ? AND listId = ?",
      [columnId, listId]
    );
    await connection.execute("DELETE FROM cells WHERE columnId = ?", [
      columnId,
    ]);
  }

  async getRows(listId: string, page: number, pageSize: number) {
    const connection = await connect();

    let query = "SELECT * FROM _rows WHERE listId = ?";
    let params: string[] = [listId];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += " LIMIT ? OFFSET ?";
      params.push(pageSize.toString(), offset.toString());
    }

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      query,
      params
    );

    const rowDataPromises = rows.map(async (row: any) => {
      const [cells]: [RowDataPacket[], FieldPacket[]] =
        await connection.execute(
          "SELECT c.id AS cellId, c.columnId, c.data, col.name AS columnName FROM cells c JOIN columns col ON c.columnId = col.id WHERE c.rowId = ?",
          [row.id]
        );

      const cellDataPromises = cells.map(async (cell: any) => {
        const column = await Common.getColumnByName(listId, cell.columnName);
        return {
          columnName: cell.columnName,
          data: column.mapDataCol(cell.data),
        };
      });

      const cellData = await Promise.all(cellDataPromises);
      row.cells = cellData.reduce((acc: any, cell: any) => {
        acc[cell.columnName] = cell.data;
        return acc;
      }, {});

      return row;
    });

    const rowsWithCells = await Promise.all(rowDataPromises);

    return rowsWithCells;
  }

  async filterRows(
    listId: string,
    column: string,
    values: string[],
    page: number,
    pageSize: number
  ) {
    const connection = await connect();

    let query = `
      SELECT DISTINCT r.id AS rowId
      FROM _rows r
      JOIN cells c ON r.id = c.rowId
      JOIN columns col ON c.columnId = col.id
      WHERE r.listId = ?
    `;
    let params: (string | number)[] = [listId];

    if (column && values.length > 0) {
      query += ` AND col.name = ? AND c.data IN (${values
        .map(() => "?")
        .join(", ")})`;
      params.push(column, ...values);
    }

    const offset = (page - 1) * pageSize;
    query += " LIMIT ? OFFSET ?";
    params.push(pageSize.toString(), offset.toString());

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      query,
      params
    );

    const rowDataPromises = rows.map(async (row: any) => {
      const [cells]: [RowDataPacket[], FieldPacket[]] =
        await connection.execute(
          "SELECT c.id AS cellId, c.columnId, c.data, col.name AS columnName FROM cells c JOIN columns col ON c.columnId = col.id WHERE c.rowId = ?",
          [row.rowId]
        );

      const cellDataPromises = cells.map(async (cell: any) => {
        const column = await Common.getColumnByName(listId, cell.columnName);
        return {
          columnName: cell.columnName,
          data: column.mapDataCol(cell.data),
        };
      });

      const cellData = await Promise.all(cellDataPromises);
      row.cells = cellData.reduce((acc: any, cell: any) => {
        acc[cell.columnName] = cell.data;
        return acc;
      }, {});

      return row;
    });

    const rowsWithCells = await Promise.all(rowDataPromises);

    return rowsWithCells;
  }

  async updateCellData(listId: string, rowId: string, data: any) {
    const connection = await connect();

    const { FieldName, FieldValue } = data;

    const column = await Common.getColumnByName(listId, FieldName);

    await connection.execute(
      "UPDATE cells SET data = ? WHERE rowId = ? AND columnId = ?",
      [FieldValue, rowId, column.id]
    );
  }

  async addRow(listId: string, formValues: any) {
    const connection = await connect();
    let row = new Row();

    await connection.execute("INSERT INTO _rows (id, listId) VALUES (?, ?)", [
      row.id,
      listId,
    ]);

    formValues.forEach(async (item: any) => {
      const { FieldName, FieldValue } = item;

      const column = await Common.getColumnByName(listId, FieldName);

      await connection.execute(
        "INSERT INTO cells (id, rowId, columnId, data) VALUES (UUID(), ?, ?, ?)",
        [row.id, column.id, FieldValue]
      );
    });
  }

  async deleteRow(listId: string, rowId: string) {
    const connection = await connect();

    await connection.execute("DELETE FROM _rows WHERE id = ? AND listId = ?", [
      rowId,
      listId,
    ]);
  }

  async getTemplates() {
    const connection = await connect();
    const [templates] = await connection.execute(
      "SELECT id, name, listId FROM templates"
    );
    return templates;
  }

  async createFromTemplate(templateId: string, newListName: string) {
    const connection = await connect();

    const [templates] = await connection.execute(
      "SELECT listId FROM templates WHERE id = ?",
      [templateId]
    );
    const listId = templates[0].listId;

    await connection.execute(
      "INSERT INTO lists (id, name) VALUES (UUID(), ?)",
      [newListName]
    );

    const [columns]: any[] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ?",
      [listId]
    );

    const [result]: any[] = await connection.execute(
      "SELECT id FROM lists WHERE name = ?",
      [newListName]
    );

    columns.forEach((col) => {
      connection.execute(
        "INSERT INTO columns (id, name, type, listId) VALUES (UUID(), ?, ?, ?)",
        [col.name, col.type, result[0].id]
      );
    });
  }
}

export default ListService;
