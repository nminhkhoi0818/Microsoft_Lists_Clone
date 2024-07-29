import express from "express";
import TemplateService from "../services/templateService";
import { TemplateController } from "../controllers/templateController";

const router = express.Router();
const templateService = new TemplateService();
const templateController = new TemplateController(templateService);

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Template]
 *     responses:
 *       200:
 *         description: A list of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/", (req, res) => templateController.getTemplates(req, res));

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Template]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
router.post("/", (req, res) => templateController.createTemplate(req, res));

/**
 * @swagger
 * /api/templates/{templateId}:
 *   put:
 *     summary: Update a template
 *     tags: [Template]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated
 *       404:
 *         description: Template not found
 */
router.put("/:templateId", (req, res) =>
  templateController.updateTemplate(req, res)
);

/**
 * @swagger
 * /api/templates/{templateId}:
 *   delete:
 *     summary: Delete a template
 *     tags: [Template]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The template ID
 *     responses:
 *       200:
 *         description: Template deleted
 *       404:
 *         description: Template not found
 */
router.delete("/:templateId", (req, res) =>
  templateController.deleteTemplate(req, res)
);

export default router;
