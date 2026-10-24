const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");

router.get("/", postsController.getAll);
router.get("/:id", postsController.getOne);
router.post("/", postsController.add);
router.patch("/:id", postsController.update);
router.delete("/:id", postsController.remove);
router.post("/:id/like", postsController.like);
router.get("/:id/comments", postsController.getComments);

module.exports = router;