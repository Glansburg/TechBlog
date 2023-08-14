// routing refers to how an applications endpoints respont to client requests.
const router = require("express").Router();
//connecting to the config connection and including models
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
//middle wear that redirect the user to the login page if they are not logged in.
const withAuth = require("../utils/auth");

//getting post data with autorization requing user seession id. adding all post, comment and user attributes to home route
router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "date_created"],
    include: [
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
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
  //// then promising database post data and getting all the readable information from user not including extra unwanted data from sequilize
    .then((dbPostData) => {
      const posts = dbPostData.map((post) =>
        post.get({
          plain: true,
        })
      );
       // rending this information to the dashboard and requiring user to be logged in session to see data.
      res.render("dashboard", {
        posts,
        loggedIn: true
      });
    })
    // if an error, gives 500 status. 
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// allowing user to edit post with a specific id. including comment data and user data
router.get("/edit/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "date_created"],
    include: [
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
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
  // promising to get database, if not database sending error message.
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post was found with this specific id",
        });
        return;
      }
// getting plain dbpost data.
      const post = dbPostData.get({
        plain: true,
      });
// rendering the edided post and requesting you to be logged in.
      res.render("edit-post", {
        post,
        loggedIn: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// allowing user to add a new post if logged in
router.get("/new", (req, res) => {
  res.render("add-post", {
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
