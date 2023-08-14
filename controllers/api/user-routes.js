const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


// This will get all of the users excluding their password attributes
router.get("/", (req, res) => {
  User.findAll({
    attributes: {
      exclude: ["password"],
    },
  })
  // exchanging this data into json format
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// this is getting the specific user data by id excluding the password.
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: {
      exclude: ["password"],
    },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "date_created"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "date_created"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
  // transfer all this data to in json format or send error status
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({
          message: "No user found with this id",
        });
        return;
      }
      res.json(dbUserData);
    })
    //console log error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Creating a user 
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
// then saving session id and username and keeping them logged in. sending over the db userdata to json format.
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData);
      });
    })
    // catching if there is an error.
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
    //  user in login that has the req.body.username
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).
  // then if it isnt dbUserdata res message. 
  then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({
        message: "No user with that username!",
      });
      return;
    }
// save the id and username if session is logged in.
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
// respond
      res.json({
        user: dbUserData,
        message: "You are now logged in!",
      });
    });
// check to see if password is valid.
    const validPassword = dbUserData.checkPassword(req.body.password);

// if not the password respond
    if (!validPassword) {
      res.status(400).json({
        message: "Incorrect password!",
      });
      return;
    }

// if it is, save id and username and keep logged in
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
// respond with success message
      res.json({
        user: dbUserData,
        message: "You are now logged in!",
      });
    });
  });
});

// logs out user session
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
