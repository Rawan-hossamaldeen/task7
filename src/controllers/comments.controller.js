
const users = require("../models/users");
const posts = require("../models/posts");
const comments = require("../models/comments");

const getAll = (req, res) => {
  res.status(200).json({
    message: "Fetched all comments",
    data: comments
  });
};

const getOne = (req, res) => {
  const id = +req.params.id;
  const comment = comments.find(e => e.id === id);

  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  res.status(200).json({
    message: "Fetched comment",
    data: comment
  });
};

const add = (req, res) => {
  const { postId, userId, text } = req.body ?? {};

  if (!postId || !userId || !text || !String(text).trim()) {
    return res.status(400).json({
      message: "postId, userId and text are required"
    });
  }

  const post = posts.find(e => e.id === +postId);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  const user = users.find(e => e.id === +userId);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const comment = {
    id: Math.max(0, ...comments.map(e => e.id)) + 1,
    postId: post.id,
    userId: user.id,
    text: String(text).trim(),
    createdAt: new Date().toISOString()
  };

  comments.push(comment);

  res.status(201).json({
    message: "Comment created",
    data: comment
  });
};

const update = (req, res) => {
  const id = +req.params.id;
  const comment = comments.find(e => e.id === id);

  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  const { text } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      message: "A non-empty text field is required"
    });
  }

  comment.text = text.trim();

  res.status(200).json({
    message: "Comment updated",
    data: comment
  });
};

const remove = (req, res) => {
  const id = +req.params.id;
  const index = comments.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  comments.splice(index, 1);

  res.status(200).json({
    message: "Comment deleted"
  });
};

module.exports = {
  getAll,
  getOne,
  add,
  update,
  remove
};
