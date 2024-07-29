import path from "path";
import fs from "fs";
import { Column } from "../models/Column";
import { ColumnFactory, Row } from "../models/Row";
import Template from "../models/Template";
import { FILE_PATHS } from "../config/default";

class TemplateService {
  templates: Template[];
  templatePath = path.resolve(__dirname, FILE_PATHS.TEMPLATES);

  constructor() {
    this.templates = [];
    this.loadTemplates();
  }

  loadTemplates() {
    const jsonData = fs.readFileSync(this.templatePath, "utf-8");
    const data = JSON.parse(jsonData);

    data.lists.forEach((item: any) => {
      const newTemplate = new Template(
        item.name,
        item.columns.map((columnData: any) => {
          return ColumnFactory.loadColumn(columnData);
        }),
        this.parseRows(item.rows),
        item.id
      );
      this.templates.push(newTemplate);
    });
  }

  parseRows(rowsData: any[]) {
    return rowsData.map((rowData: any) => {
      const columns = rowData.columns.map((columnData: any) => {
        let column = ColumnFactory.loadColumn(columnData);
        column.setValue(columnData.value);
        return column;
      });
      let row = new Row(columns);
      row.columns = columns;
      return row;
    });
  }

  createTemplate(name: string, columns: Column[], rows: Row[]) {
    if (this.templates.find((template) => template.name === name)) {
      throw new Error("Template already exists");
    }

    const newTemplate = new Template(name, columns, rows);
    this.templates.push(newTemplate);
    this.saveLists(this.templatePath);
    return newTemplate;
  }

  updateTemplate(
    templateId: string,
    name: string,
    columns: Column[],
    rows: Row[]
  ) {
    const template = this.templates.find(
      (template) => template.id === templateId
    );
    if (!template) {
      throw new Error("Template not found");
    }

    template.name = name;
    template.columns = columns;
    template.rows = rows;
    this.saveLists(this.templatePath);
  }

  deleteTemplate(templateId: string) {
    this.templates = this.templates.filter(
      (template) => template.id !== templateId
    );
  }

  saveLists(filePath: string) {
    const data = {
      lists: this.templates,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

export default TemplateService;
