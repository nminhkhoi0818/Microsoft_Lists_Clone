import express from "express";
import { ListController } from "../controllers/listController";
import ListService from "../services/listService";

const router = express.Router();
const listService = new ListService();
const listController = new ListController(listService);

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists
 *     tags: [List]
 *     responses:
 *       200:
 *         description: A list of lists
 */
router.get("/", (req, res) => {
  listController.getLists(req, res);
});

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
router.post("/", (req, res) => {
  listController.createList(req, res);
});

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

router.delete("/:listId", (req, res) => {
  listController.deleteList(req, res);
});

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
router.post("/:listId/columns", (req, res) => {
  listController.addColumn(req, res);
});

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
router.delete("/:listId/columns/:columnId", (req, res) => {
  listController.deleteColumn(req, res);
});

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
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Row added
 */
router.post("/:listId/rows", (req, res) => {
  listController.addRow(req, res);
});

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
router.delete("/:listId/rows/:rowId", (req, res) => {
  listController.deleteRow(req, res);
});

/**
 * @swagger
 * /api/lists/{listId}/columns/{columnId}/options:
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
 *               option:
 *                 type: string
 *                 description: The option to be added to the column
 *     responses:
 *       200:
 *         description: Option added
 *       400:
 *         description: Bad request
 */
router.post("/:listId/columns/:columnId/options", (req, res) => {
  listController.addOption(req, res);
});

export default router;
