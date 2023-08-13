const router = require('express').Router();
const userRoutes = require('./user-routes.js');


// FETCH POST api/users/login 
// NOT LOGIN FORM. But create user logic
// Different from /login which is the handlebars/html
router.use('/users', userRoutes);


router.use((req, res) => {
    res.status(404).end();
});


module.exports = router;