import express from "express";
import { ListController } from "../controllers/listController";
import ListService from "../services/listService";

const router = express.Router();
const listService = new ListService();
const listController = new ListController(listService);

router.get("/", (req, res) => {
  listController.getAllLists(req, res);
});

router.get("/templates", (req, res) => {
  listController.getAllTemplates(req, res);
});

router.get("/:listId", (req, res) => {
  listController.getListById(req, res);
});

router.post("/", (req, res) => {
  listController.createList(req, res);
});

router.post("/from-template", (req, res) => {
  listController.createFromTemplate(req, res);
});

router.delete("/:listId", (req, res) => {
  listController.deleteList(req, res);
});

router.post("/:listId/columns", (req, res) => {
  listController.addColumn(req, res);
});

router.put("/:listId/columns/:columnId", (req, res) => {
  listController.updateColumn(req, res);
});

router.delete("/:listId/columns/:columnId", (req, res) => {
  listController.deleteColumn(req, res);
});

router.get("/:listId/rows", (req, res) => {
  listController.getRows(req, res);
});

router.post("/:listId/rows", (req, res) => {
  listController.addRow(req, res);
});

router.get("/:listId/rows/filter", (req, res) => {
  listController.filterRows(req, res);
});

router.put("/:listId/rows/:rowId", (req, res) => {
  listController.updateCellData(req, res);
});

router.delete("/:listId/rows/:rowId", (req, res) => {
  listController.deleteRow(req, res);
});

router.post("/:listId/columns/:columnId/choices", (req, res) => {
  listController.addChoice(req, res);
});

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists
 *     tags: [List]
 *     responses:
 *       200:
 *         description: A list of all lists
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/{listId}:
 *   get:
 *     summary: Get a list by its ID
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the list
 *     responses:
 *       200:
 *         description: The list with the specified ID
 */

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: List created
 */

/**
 * @swagger
 * /api/lists/templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Template]
 *     responses:
 *       200:
 *         description: A list of all templates
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/from-template:
 *   post:
 *     summary: Create a new list from a template
 *     tags: [Template]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateId:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: List created
 */

/**
 * @swagger
 * /api/lists/{listId}:
 *   delete:
 *     summary: Delete a list
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: List deleted
 */

/**
 * @swagger
 * /api/lists/{listId}/columns:
 *   post:
 *     summary: Add a column to a list
 *     tags: [Column]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Column added
 */

/**
 * @swagger
 * /api/lists/{listId}/columns/{columnId}:
 *   put:
 *     summary: Update a column in a list
 *     tags: [Column]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Column updated
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/{listId}/columns/{columnId}:
 *   delete:
 *     summary: Delete a column from a list
 *     tags: [Column]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Column deleted
 */

/**
 * @swagger
 * /api/lists/{listId}/rows:
 *   get:
 *     summary: Get rows from a list
 *     tags: [Row]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to retrieve
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term to filter rows
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The field to sort by (e.g., 'Title', 'Date')
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of rows per page
 *     responses:
 *       200:
 *         description: The list with the specified ID
 *       404:
 *         description: List not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/{listId}/rows/filter:
 *   get:
 *     summary: Get filtered rows from a list
 *     tags: [Row]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to retrieve
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *           description: The column to filter by
 *       - in: query
 *         name: value
 *         schema:
 *           type: array
 *           description: The value to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of rows per page
 *     responses:
 *       200:
 *         description: The list with the specified ID
 *       404:
 *         description: List not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/{listId}/rows:
 *   post:
 *     summary: Add a row to a list
 *     tags: [Row]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formValues:
 *                 type: object
 *     responses:
 *       201:
 *         description: Row added
 */

/**
 * @swagger
 * /api/lists/{listId}/rows/{rowId}:
 *   put:
 *     summary: Update a cell in a row
 *     tags: [Row]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rowId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Row updated
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/lists/{listId}/rows/{rowId}:
 *   delete:
 *     summary: Delete a row from a list
 *     tags: [Row]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rowId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Row deleted
 */

/**
 * @swagger
 * /api/lists/{listId}/columns/{columnId}/choices:
 *   post:
 *     summary: Add an option to a column
 *     tags: [Column]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the column
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               choice:
 *                 type: string
 *                 description: The choice to be added to the column
 *     responses:
 *       200:
 *         description: Option added
 *       400:
 *         description: Bad request
 */

export default router;
