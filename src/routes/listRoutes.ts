import express from "express";
import { ListController } from "../controllers/listController";
import ListService from "../services/listService";

const router = express.Router();
const listService = new ListService();
const listController = new ListController(listService);

router.post("/", (req, res) => {
  listController.createList(req, res);
});

router.get("/", (req, res) => {
  listController.getLists(req, res);
});

export default router;
