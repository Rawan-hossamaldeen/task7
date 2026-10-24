const users = require("../models/users");
const posts = require("../models/posts");
const comments = require("../models/comments");

const getAll = (req, res) => {
  const { tag } = req.query;

  if (!tag) {
    return res.status(200).json({ message: "Fetched all posts", data: posts });
  }

  const filtered = posts.filter(p =>
    p.tags.some(t => t.toLowerCase() === String(tag).toLowerCase())
  );

  res.status(200).json({ message: "Fetched posts by tag", data: filtered });
};

const getOne = (req, res) => {
  const id = +req.params.id;
  const post = posts.find(e => e.id === id);

  if (!post) return res.status(404).json({ message: "Post Not Found" });

  res.status(200).json({ message: "Fetched post", data: post });
};

const add = (req, res) => {
  const { userId, title, content, tags } = req.body ?? {};

  if (!userId || !title || !content) {
    return res.status(400).json({ message: "userId, title and content are required" });
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    return res.status(400).json({ message: "tags must be an array" });
  }

  const user = users.find(e => e.id === +userId);
  if (!user) return res.status(404).json({ message: "User Not Found" });

  const now = new Date().toISOString();

  const data = {
    id: Math.max(0, ...posts.map(e => e.id)) + 1,
    userId: user.id,
    title,
    content,
    tags: tags || [],
    likes: 0,
    createdAt: now,
    updatedAt: now
  };

  posts.push(data);

  res.status(201).json({ message: "Post created", data });
};

const update = (req, res) => {
  const id = +req.params.id;
  const post = posts.find(e => e.id === id);

  if (!post) return res.status(404).json({ message: "Post Not Found" });

  const { title, content, tags } = req.body ?? {};

  if (tags !== undefined && !Array.isArray(tags)) {
    return res.status(400).json({ message: "tags must be an array" });
  }

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) post.tags = tags;
  post.updatedAt = new Date().toISOString();

  res.status(200).json({ message: "Post updated", data: post });
};

const remove = (req, res) => {
  const id = +req.params.id;
  const post = posts.find(e => e.id === id);

  if (!post) return res.status(404).json({ message: "Post Not Found" });

  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].postId === id) comments.splice(i, 1);
  }

  posts.splice(posts.indexOf(post), 1);

  res.status(200).json({ message: "Post deleted" });
};

const like = (req, res) => {
  const id = +req.params.id;
  const post = posts.find(e => e.id === id);

  if (!post) return res.status(404).json({ message: "Post Not Found" });

  post.likes += 1;

  res.status(200).json({ message: "Post liked", data: post });
};

const getComments = (req, res) => {
  const id = +req.params.id;
  const post = posts.find(e => e.id === id);

  if (!post) return res.status(404).json({ message: "Post Not Found" });

  const postComments = comments.filter(e => e.postId === id);

  res.status(200).json({ message: "Fetched post comments", data: postComments });
};

module.exports = { getAll, getOne, add, update, remove, like, getComments };