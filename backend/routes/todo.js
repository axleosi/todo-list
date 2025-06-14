import express from 'express';
import Todo from '../models/todoModel.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Create a new todo
router.post('/todo', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newTodo = new Todo({
      title,
      user: req.user._id,
    });

    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all todos for the logged-in user
router.get('/todo', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a todo
router.put('/todo/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo
router.delete('/todo/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
