import TemplateService from "../services/templateService";

export class TemplateController {
  private templateService: TemplateService;

  constructor(templateService: TemplateService) {
    this.templateService = templateService;
  }

  getTemplates(req, res) {
    res.json(this.templateService.templates);
  }

  createTemplate(req, res) {
    try {
      const { name, columns, rows } = req.body;
      const newTemplate = this.templateService.createTemplate(
        name,
        columns,
        rows
      );
      res.status(201).json(newTemplate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  updateTemplate(req, res) {
    try {
      const templateId = req.params.templateId;
      const { name, columns, rows } = req.body;
      this.templateService.updateTemplate(templateId, name, columns, rows);
      res.status(200).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteTemplate(req, res) {
    try {
      const templateId = req.params.templateId;
      this.templateService.deleteTemplate(templateId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
