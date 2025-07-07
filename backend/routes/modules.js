const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

console.log('✅ modules.js router loaded');

// Get modules (optionally filter by type)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const modules = await Module.find(query);
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Create a module
router.post('/', async (req, res) => {
  try {
    const moduleDoc = new Module(req.body);
    await moduleDoc.save();
    res.status(201).json(moduleDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create module' });
  }
});

// Update a module
router.put('/:id', async (req, res) => {
  console.log('PUT /backend/modules/:id called with id:', req.params.id);
  console.log('Request body:', req.body);
  try {
    const moduleDoc = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found' });
    res.json(moduleDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// Delete a module
router.delete('/:id', async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

module.exports = router;
