
const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.controller");

router.get("/", commentsController.getAll);
router.get("/:id", commentsController.getOne);
router.post("/", commentsController.add);
router.patch("/:id", commentsController.update);
router.delete("/:id", commentsController.remove);

module.exports = router;
