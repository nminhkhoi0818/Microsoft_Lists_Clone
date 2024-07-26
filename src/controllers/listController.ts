import ListService from "../services/listService";

export class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  createList(req, res) {
    try {
      const { name } = req.body;
      const newList = this.listService.createList(name);
      res.status(201).json(newList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  createFromTemplate(req, res) {
    try {
      const { name, templateId } = req.body;
      const newList = this.listService.createFromTemplate(name, templateId);
      res.status(201).json(newList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  getTemplates(req, res) {
    res.json(this.listService.templates);
  }

  getLists(req, res) {
    res.json(this.listService.lists);
  }

  deleteList(req, res) {
    try {
      const listId = req.params.listId;
      this.listService.deleteList(listId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  addColumn(req, res) {
    try {
      const listId = req.params.listId;
      this.listService.addColumn(listId, req.body);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteColumn(req, res) {
    try {
      const listId = req.params.listId;
      const columnId = req.params.columnId;
      this.listService.deleteColumn(listId, columnId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  addRow(req, res) {
    try {
      const listId = req.params.listId;
      const { data } = req.body;
      this.listService.addRow(listId, data);
      res.status(201).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteRow(req, res) {
    try {
      const listId = req.params.listId;
      const rowId = req.params.rowId;
      this.listService.deleteRow(listId, rowId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  addOption(req, res) {
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
