import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { EnumColumnType } from "../models/Enum";
import Common from "../utils/Common";
import { connect } from "../db";

class ListService {
  async getAllLists(page: number, pageSize: number) {
    const connection = await connect();

    const offset = (page - 1) * pageSize;

    const [rows] = await connection.execute(
      `SELECT id, name FROM lists LIMIT ${pageSize} OFFSET ${offset}`
    );
    return rows;
  }

  async createList(name: string) {
    const connection = await connect();

    await Common.ensureListDoesNotExist(name);

    const [result]: any = await connection.execute(
      "INSERT INTO lists (name) VALUES (?)",
      [name]
    );

    return { id: result.insertId, name: name };
  }

  async getListById(listId: string) {
    const connection = await connect();
    const [result] = await connection.execute(
      "SELECT * FROM lists WHERE id = ?",
      [listId]
    );

    return { id: result[0].id, name: result[0].name };
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

    const columnsMap: Record<number, any> = {};

    rows.forEach((row: any) => {
      columnsMap[row.columnId] = {
        columnId: row.columnId,
        name: row.name,
        type: row.type
      };

      const handleConfig = Common.configHandlers[row.config_name];
      if (handleConfig) {
        columnsMap[row.columnId][row.config_name] = handleConfig(
          row.config_value
        );
      }
    });

    const columns = Object.values(columnsMap);

    return columns;
  }

  async addColumn(listId: string, data: any) {
    const connection = await connect();
    const { name, type, config } = data;

    await Common.ensureColumnDoesNotExist(listId, name);
    Common.checkValidType(type);

    const [result]: any = await connection.execute(
      "INSERT INTO columns (name, type, listId) VALUES (?, ?, ?)",
      [name, type, listId]
    );

    config.forEach(async (item: any) => {
      const { configName, configValue } = item;

      Common.checkValidConfig(configName);

      await connection.execute(
        "INSERT INTO columns_settings(columnId, config_name, config_value) VALUES(?, ?, ?)",
        [result.insertId, configName, configValue]
      );
    });

    return { id: result.insertId, name, type };
  }

  async updateColumn(
    listId: string,
    columnId: string,
    name: string,
    type: EnumColumnType
  ) {
    const connection = await connect();

    await Common.ensureColumnExist(listId, columnId);

    await connection.execute(
      "UPDATE columns SET name = ?, type = ? WHERE id = ?",
      [name, type, columnId]
    );
  }

  async deleteColumn(listId: string, columnId: string) {
    const connection = await connect();

    await connection.execute(
      "DELETE FROM columns_settings WHERE columnId = ?",
      [columnId]
    );
    await connection.execute(
      "DELETE FROM columns WHERE id = ? AND listId = ?",
      [columnId, listId]
    );
    await connection.execute("DELETE FROM cells WHERE columnId = ?", [
      columnId
    ]);

    return { message: "Column deleted" };
  }

  async addRow(listId: string, formValues: any) {
    const connection = await connect();

    const [result]: any = await connection.execute(
      "INSERT INTO _rows (listId) VALUES (?)",
      [listId]
    );

    await Promise.all(
      formValues.map(async (item: any) => {
        const { FieldName, FieldValue } = item;

        const column = await Common.getColumnByName(listId, FieldName);

        await connection.execute(
          "INSERT INTO cells (rowId, columnId, data) VALUES (?, ?, ?)",
          [result.insertId, column.id, FieldValue]
        );
      })
    );

    return { id: result.insertId };
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
          data: column.mapDataCol(cell.data)
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
          data: column.mapDataCol(cell.data)
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

  async deleteRow(listId: string, rowId: string) {
    const connection = await connect();

    await connection.execute("DELETE FROM _rows WHERE id = ? AND listId = ?", [
      rowId,
      listId
    ]);
  }

  async getTemplates(page: number, pageSize: number) {
    const connection = await connect();

    const offset = (page - 1) * pageSize;

    const [templates] = await connection.execute(
      `SELECT id, name, listId FROM templates LIMIT ${pageSize} OFFSET ${offset}`
    );
    return templates;
  }

  async createTemplate(name: string, listId: string) {
    const connection = await connect();

    await connection.execute(
      "INSERT INTO templates (name, listId) VALUES (?, ?)",
      [name, listId]
    );
  }

  async createFromTemplate(templateId: string, newListName: string) {
    const connection = await connect();

    const [templates] = await connection.execute(
      "SELECT listId FROM templates WHERE id = ?",
      [templateId]
    );

    const listId = templates[0].listId;

    const [columns]: any[] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ?",
      [listId]
    );

    await Common.ensureListDoesNotExist(newListName);
    const [result]: any = await connection.execute(
      "INSERT INTO lists (name) VALUES (?)",
      [newListName]
    );

    columns.forEach((col) => {
      connection.execute(
        "INSERT INTO columns (name, type, listId) VALUES (?, ?, ?)",
        [col.name, col.type, result.insertId]
      );
    });

    return { id: result.insertId, name: newListName };
  }

  async getTemplateById(templateId: string) {
    const connection = await connect();

    const [template] = await connection.execute(
      "SELECT * FROM templates WHERE id = ?",
      [templateId]
    );

    const [columns]: any[] = await connection.execute(
      "SELECT * FROM columns WHERE listId = ?",
      [template[0].listId]
    );

    template[0].columns = columns;

    const [rows]: any[] = await connection.execute(
      "SELECT * FROM _rows WHERE listId = ?",
      [template[0].listId]
    );

    const rowDataPromises = rows.map(async (row: any) => {
      const [cells]: [RowDataPacket[], FieldPacket[]] =
        await connection.execute(
          "SELECT c.id AS cellId, c.columnId, c.data, col.name AS columnName FROM cells c JOIN columns col ON c.columnId = col.id WHERE c.rowId = ?",
          [row.id]
        );

      const cellDataPromises = cells.map(async (cell: any) => {
        const column = await Common.getColumnByName(
          template[0].listId,
          cell.columnName
        );
        return {
          columnName: cell.columnName,
          data: column.mapDataCol(cell.data)
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

    template[0].rows = rowsWithCells;

    return template[0];
  }
}

export default ListService;
