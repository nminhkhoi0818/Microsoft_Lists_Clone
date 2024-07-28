import { Column } from "../models/Column";
import { Row } from "../models/Row";
import Template from "../models/Template";

class TemplateService {
  templates: Template[];

  constructor() {
    this.templates = [];
  }

  createTemplate(name: string, columns: Column[], rows: Row[]) {
    const newTemplate = new Template(name, columns, rows);
    this.templates.push(newTemplate);
    return newTemplate;
  }

  deleteTemplate(templateId: string) {
    this.templates = this.templates.filter(
      (template) => template.id !== templateId
    );
  }
}

export default TemplateService;
