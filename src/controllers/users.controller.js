const users = require("../models/users");
const posts = require("../models/posts");
const comments = require("../models/comments");

const getAll = (req, res) => {
  res.status(200).json({ message: "Fetched all users", data: users });
};

const getOne = (req, res) => {
  const id = +req.params.id;
  const user = users.find(e => e.id === id);

  if (!user) return res.status(404).json({ message: "User Not Found" });

  res.status(200).json({ message: "Fetched user", data: user });
};

const add = (req, res) => {
  const { username, fullName, email, bio, avatar } = req.body ?? {};

  if (!username || !fullName || !email) {
    return res.status(400).json({ message: "username, fullName and email are required" });
  }

  if (users.find(e => e.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  if (users.find(e => e.email === email)) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const data = {
    id: Math.max(0, ...users.map(e => e.id)) + 1,
    username,
    fullName,
    email,
    bio: bio || "",
    avatar: avatar || "",
    role: "member",
    createdAt: new Date().toISOString()
  };

  users.push(data);

  res.status(201).json({ message: "User created", data });
};

const update = (req, res) => {
  const id = +req.params.id;
  const user = users.find(e => e.id === id);

  if (!user) return res.status(404).json({ message: "User Not Found" });

  const { fullName, bio, avatar } = req.body ?? {};

  if (fullName !== undefined) user.fullName = fullName;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  res.status(200).json({ message: "User updated", data: user });
};

const remove = (req, res) => {
  const id = +req.params.id;
  const user = users.find(e => e.id === id);

  if (!user) return res.status(404).json({ message: "User Not Found" });


  const userPostIds = posts.filter(p => p.userId === id).map(p => p.id);
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].userId === id || userPostIds.includes(comments[i].postId)) {
      comments.splice(i, 1);
    }
  }

  for (let i = posts.length - 1; i >= 0; i--) {
    if (posts[i].userId === id) posts.splice(i, 1);
  }


  users.splice(users.indexOf(user), 1);

  res.status(200).json({ message: "User deleted" });
};

const getPosts = (req, res) => {
  const id = +req.params.id;
  const user = users.find(e => e.id === id);

  if (!user) return res.status(404).json({ message: "User Not Found" });

  const userPosts = posts.filter(e => e.userId === id);

  res.status(200).json({ message: "Fetched user posts", data: userPosts });
};

module.exports = { getAll, getOne, add, update, remove, getPosts };