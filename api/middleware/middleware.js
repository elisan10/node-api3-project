const Users = require("../users/users-model");
// const Posts = require("../posts/posts-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req, res, next);
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: `User not found`,
        });
      } else {
        req.user = user;
        next();
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  if (!req.body.name || !req.body.name.trim()) {
    res.status(400).json({
      message: "missing required name field",
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body.text || !req.body.text.trim()) {
    res.status(400).json({
      message: "name is required",
    });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
