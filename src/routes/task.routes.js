const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUser
} = require('../controllers/task.controller');

// Anyone authenticated can fetch tasks
router.get('/user/:userId', verifyToken, getTasksByUser);

// Only Admin and Manager can create tasks
router.post('/', verifyToken, authorizeRoles('Admin', 'Manager'), createTask);

// Anyone assigned can get, update, or delete their task
router.get('/:id', verifyToken, getTaskById);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;