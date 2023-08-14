const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

// Get all of the posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "content", "date_created"],
    // retrieves them in a date created descending order.
    order: [["date_created", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "user_id",
          "post_id",
          "date_created",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    // respond dbPostData to json or console error
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// this will get one single post by its id.
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "date_created"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "user_id",
          "post_id",
          "date_created",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    // then respond dbpostdata to json. if not send error message
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    //catch error in console log
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// this will create a post
router.post("/", withAuth, (req, res) => {
  console.log("creating");
  //requesting the title, content and session userID to create post.
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    //then responding the dbPostData to json if it doesnt catches error in console.
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// This will update a post
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    // then respond it to json or send error message.
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    //catches error in console.
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// This will delete a post
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    //then respond it to json format or send error message to user.
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(dbPostData);
    })
    // console log err
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
