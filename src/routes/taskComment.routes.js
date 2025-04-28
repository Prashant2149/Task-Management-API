const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { addComment, getCommentsByTask } = require('../controllers/taskComment.controller');

// Routes
router.post('/:taskId', verifyToken, addComment);
router.get('/:taskId', verifyToken, getCommentsByTask);

module.exports = router;