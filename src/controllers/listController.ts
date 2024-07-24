import ListService from "../services/listService";

export class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  createList(req, res) {
    const { name } = req.body;
    const newList = this.listService.createList(name);
    res.status(201).json(newList);
  }

  createFromTemplate(req, res) {
    const { name, templateId } = req.body;
    const newList = this.listService.createFromTemplate(name, templateId);
    if (newList) {
      res.status(201).json(newList);
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  }

  getLists(req, res) {
    res.json(this.listService.lists);
  }

  getList(req, res) {
    const { name } = req.params;
    const list = this.listService.getList(name);
    if (list) {
      res.json(list);
    } else {
      res.status(404).json({ error: "List not found" });
    }
  }

  deleteList(req, res) {
    const { name } = req.params;
    this.listService.deleteList(name);
    res.status(204).send();
  }
}
