import { Request, Response } from "express";
import ListService from "../services/listService";

export class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  async createList(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const newList = await this.listService.createList(name);
      res.status(201).json(newList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllLists(req: Request, res: Response) {
    try {
      const lists = await this.listService.getAllLists();
      res.json(lists);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListById(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const list = await this.listService.getListById(listId);
      res.json(list);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  deleteList(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      this.listService.deleteList(listId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getColumns(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const columns = await this.listService.getColumns(listId);
      res.json(columns);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  addColumn(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      this.listService.addColumn(listId, req.body);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  updateColumn(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const columnId = req.params.columnId;
      const { name, type } = req.body;
      this.listService.updateColumn(listId, columnId, name, type);
      res.status(200).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteColumn(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const columnId = req.params.columnId;
      this.listService.deleteColumn(listId, columnId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getRows(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const page = parseInt(req.query.page as string);
      const pageSize = parseInt(req.query.pageSize as string);

      res.json(await this.listService.getRows(listId, page, pageSize));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  addRow(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const { formValues } = req.body;
      this.listService.addRow(listId, formValues);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFilteredRows(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const column = req.query.column as string;
      const values = req.query.value as string[];
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const rows = await this.listService.filterRows(
        listId,
        column,
        values,
        page,
        pageSize
      );
      res.json(rows);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  updateCellValue(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const rowId = req.params.rowId;
      const { formValues } = req.body;
      this.listService.updateCellData(listId, rowId, formValues);
      res.status(200).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteRow(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const rowId = req.params.rowId;
      this.listService.deleteRow(listId, rowId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTemplates(req: Request, res: Response) {
    try {
      res.json(await this.listService.getTemplates());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  createFromTemplate(req: Request, res: Response) {
    try {
      const { templateId, name } = req.body;
      this.listService.createFromTemplate(templateId, name);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
