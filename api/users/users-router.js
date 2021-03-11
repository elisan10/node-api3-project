const express = require("express");
const {
  // logger,
  validateUserId,
  validateUser,
  validatePost,
  // validatePost,
} = require("./../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both

const Users = require("./users-model");
const Posts = require("./../posts/posts-model");
const { json } = require("express");

// The middleware functions also need to be required

const router = express.Router();

router.get("/", async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const user = await Users.get(req.query);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(() => {
      res.json(req.user);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
    .then(() => {
      res.json(req.user);
    })
    .catch(next);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // if (!req.payload) {
  //   res.status(400).json({ message: "missing user data" });
  // } else {
  //   res.status(500).json({ message: err.message });
  // }

  res.status(500).json({
    message: err.message, // DEV
    stack: err.stack, // DEV
    custom: "something went terrible in the hubs router", // PRODUCTION
  });
});

// do not forget to export the router

module.exports = router;
