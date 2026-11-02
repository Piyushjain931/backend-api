const express = require('express');
const requireAuth = require('../middleware/auth');
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();
router.use(requireAuth);
router.route('/').post(createPost).get(getPosts);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;
