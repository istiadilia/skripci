const express = require('express');

const {
    addNewPost,
    getAllPost,
    getPostById,
    updatePostById,
    deletePostById,
} = require('./handler');

const router = express.Router();

router.post('/', addNewPost);
router.get('/', getAllPost);
router.get('/:postId', getPostById);
router.put('/:postId', updatePostById);
router.delete('/:postId', deletePostById);

module.exports = router;