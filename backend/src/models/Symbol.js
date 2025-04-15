const mongoose = require('mongoose');

const SymbolSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  column: {
    type: String,
    required: true,
    enum: ['Column C', 'Column D', 'Column E', 'Column F', 'Column G', 'Column H'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Symbol', SymbolSchema);
