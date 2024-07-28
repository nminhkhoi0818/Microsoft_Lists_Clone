import express from "express";
import TemplateService from "../services/templateService";
import { TemplateController } from "../controllers/templateController";

const router = express.Router();
const templateService = new TemplateService();
const templateController = new TemplateController(templateService);

router.get("/", (req, res) => templateController.getTemplates(req, res));
router.post("/", (req, res) => templateController.createTemplate(req, res));
router.delete("/:templateId", (req, res) =>
  templateController.deleteTemplate(req, res)
);

export default router;
