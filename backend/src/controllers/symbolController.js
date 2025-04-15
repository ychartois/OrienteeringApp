const Symbol = require('../models/Symbol');

// Get all symbols
exports.getAllSymbols = async (req, res) => {
  try {
    const symbols = await Symbol.find();
    res.status(200).json(symbols);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get symbol by ID
exports.getSymbolById = async (req, res) => {
  try {
    const symbol = await Symbol.findById(req.params.id);
    if (!symbol) {
      return res.status(404).json({ message: 'Symbol not found' });
    }
    res.status(200).json(symbol);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get symbols by column
exports.getSymbolsByColumn = async (req, res) => {
  try {
    const symbols = await Symbol.find({ column: req.params.column });
    res.status(200).json(symbols);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get symbols by type
exports.getSymbolsByType = async (req, res) => {
  try {
    const symbols = await Symbol.find({ type: req.params.type });
    res.status(200).json(symbols);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new symbol
exports.createSymbol = async (req, res) => {
  try {
    const newSymbol = new Symbol(req.body);
    const savedSymbol = await newSymbol.save();
    res.status(201).json(savedSymbol);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a symbol
exports.updateSymbol = async (req, res) => {
  try {
    const updatedSymbol = await Symbol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSymbol) {
      return res.status(404).json({ message: 'Symbol not found' });
    }
    res.status(200).json(updatedSymbol);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a symbol
exports.deleteSymbol = async (req, res) => {
  try {
    const deletedSymbol = await Symbol.findByIdAndDelete(req.params.id);
    if (!deletedSymbol) {
      return res.status(404).json({ message: 'Symbol not found' });
    }
    res.status(200).json({ message: 'Symbol deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
