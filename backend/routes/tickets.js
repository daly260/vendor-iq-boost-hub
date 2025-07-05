const express = require('express');
const Ticket = require('../models/Ticket.js');

const router = express.Router();

// Get all tickets (optional filtering by userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, type, status, priority } = req.body;
    if (!userId || !title || !description || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticket = new Ticket({
      userId,
      title,
      description,
      type,
      status: status || 'open',
      priority: priority || 'medium',
      messages: [],
      createdAt: new Date()
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Add a message to a ticket
router.post('/:id/message', async (req, res) => {
  try {
    const { sender, text } = req.body;
    if (!sender || !text) {
      return res.status(400).json({ error: 'sender and text are required' });
    }
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.messages.push({ sender, text });
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update ticket status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete a ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;
