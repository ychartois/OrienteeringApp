const express = require('express');
const router = express.Router();
const symbolController = require('../controllers/symbolController');

// Get all symbols
router.get('/', symbolController.getAllSymbols);

// Get symbol by ID
router.get('/:id', symbolController.getSymbolById);

// Get symbols by column
router.get('/column/:column', symbolController.getSymbolsByColumn);

// Get symbols by type
router.get('/type/:type', symbolController.getSymbolsByType);

// Create a new symbol
router.post('/', symbolController.createSymbol);

// Update a symbol
router.put('/:id', symbolController.updateSymbol);

// Delete a symbol
router.delete('/:id', symbolController.deleteSymbol);

module.exports = router;
