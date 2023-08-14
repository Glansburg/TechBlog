// routing refers to how an applications endpoints respont to client requests.
const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const commentRoutes = require('./comment.routes.js')


// FETCH POST api/users/login 
// NOT LOGIN FORM. But create user logic
// Different from /login which is the handlebars/html
router.use('/users', userRoutes);
router.use('./posts', postRoutes);
router.use('./comments', commentRoutes);



router.use((req, res) => {
    res.status(404).end();
});


module.exports = router;