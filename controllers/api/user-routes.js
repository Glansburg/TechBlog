const router = require('express').Router();

const {
    User
} = require('../../models');


router.get('/login', (req, res) => {
    res.status({messsage:"to be done"})
    // Check req username and password against User model to see if matches
});



module.exports = router;
