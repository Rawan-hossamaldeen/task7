const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.getAll);
router.get("/:id", usersController.getOne);
router.post("/", usersController.add);
router.patch("/:id", usersController.update);
router.delete("/:id", usersController.remove);
router.get("/:id/posts", usersController.getPosts);

module.exports = router;