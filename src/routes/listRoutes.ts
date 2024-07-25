import express from "express";
import { ListController } from "../controllers/listController";
import ListService from "../services/listService";

const router = express.Router();
const listService = new ListService();
const listController = new ListController(listService);

router.get("/", (req, res) => {
  listController.getLists(req, res);
});

router.post("/", (req, res) => {
  listController.createList(req, res);
});

router.delete("/:listId", (req, res) => {
  listController.deleteList(req, res);
});

router.post("/:listId/columns", (req, res) => {
  listController.addColumn(req, res);
});

router.post("/:listId/rows", (req, res) => {
  listController.addRow(req, res);
});

// router.get("/{list-id}/search", (req, res) => {
//   listController.search(req, res);
// })

export default router;
