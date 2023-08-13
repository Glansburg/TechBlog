// routing refers to how an applications endpoints respont to client requests.
const router = require("express").Router();
// connecting to the config file with your models
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

// routing to the login handlebars layout.
router.get("/", (req, res) => {
  res.render("login");
  // finding all attributes for post for the root route.
  Post.findAll({
    attributes: ["id", "title", "content", "date_created"],
    // including all comment attributes for root route
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
        // including the user name in root route in comments
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        //including the user name for post in root route.
        model: User,
        attributes: ["username"],
      },
    ],
    // then promising database post data and getting all the readable information from user not including extra unwanted data from sequilize
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) =>
        post.get({
          plain: true,
        })
      );
    // rending this information to the home page and requiring user to be logged in session to see data.
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    // if an error, gives 500 status.
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// finding the id of post in the params and including all post attributes.
router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "date_created"],
    // including Comment model with all its attributes and user model for the username.
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
  // then promising the dbpost data, if not you receive an error message.
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post was found with this specific id",
        });
        return;
      }
// getting the post dbdata plain.
      const post = dbPostData.get({
        plain: true,
      });
// rendering it into a single post with post as argument, requring loggedin session to see. if not logged in receive an 500 status error.
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// route for you to login handlebars, if you are logged in redirects you to root page.
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  //renders user to login as argument
  res.render("login");
});

// route for you to signup to site. if you are logged in redirects you to root page.
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
// renders user to signup as argument
  res.render("signup");
});

// if you try to select everything it will send you an error saying you cannot.
router.get("*", (req, res) => {
  res.status(404).send("You cannot select this");
  // res.redirect('/');
});

module.exports = router;
