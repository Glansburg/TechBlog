const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// makes it so the user can own multiple posts
User.hasMany(Post, {
    foreignKey: 'user_id'
})

// makes it so the user can have multiple comment id
User.hasMany(Comment, {
    foreignKey: 'user_id'
})

// Shows who the post belongs to.
Post.belongsTo(User, {
    foreignKey: 'user_id'
})

// makes it so posts can have multiple comment post id
Post.hasMany(Comment, {
    foreignKey: 'post_id'
})

// Shows who the comment belongs to.
Comment.belongsTo(User, {
    foreignKey: 'user_id'
})

// Makes it so the comment will refer to that particular post.
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
})


module.exports = {
    User,
    Post,
    Comment
};