import { Request, Response } from "express";
import ListService from "../services/listService";

export class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  createList(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const newList = this.listService.createList(name);
      res.status(201).json(newList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  createFromTemplate(req: Request, res: Response) {
    try {
      const { name, templateId } = req.body;
      const newList = this.listService.createFromTemplate(name, templateId);
      res.status(201).json(newList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  getAllLists(req: Request, res: Response) {
    try {
      const lists = this.listService.getAllLists();
      res.json(lists);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllTemplates(req: Request, res: Response) {
    try {
      const templates = this.listService.getAllTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  getListById(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const list = this.listService.getListById(listId);
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

  getRows(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      const page = parseInt(req.query.page as string);
      const pageSize = parseInt(req.query.pageSize as string);

      res.json(this.listService.getRows(listId, search, sort, page, pageSize));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  filterRows(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const column = req.query.column as string;
      const value = req.query.value as string[];
      const page = parseInt(req.query.page as string);
      const pageSize = parseInt(req.query.pageSize as string);

      res.json(
        this.listService.filterRows(listId, column, value, page, pageSize)
      );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  addRow(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const { data } = req.body;
      this.listService.addRow(listId, data);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  updateRow(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const rowId = req.params.rowId;
      const { data } = req.body;
      this.listService.updateRow(listId, rowId, data);
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

  addOption(req: Request, res: Response) {
    try {
      const listId = req.params.listId;
      const columnId = req.params.columnId;
      const { option } = req.body;
      this.listService.addOption(listId, columnId, option);
      res.status(200).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
