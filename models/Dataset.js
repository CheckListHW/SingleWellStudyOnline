const { Schema, model } = require('mongoose');
const schema = new Schema({
  datasetId: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  downloadDate: { type: Date, default: Date.now },
  data: { type: String, required: true },
}, { versionKey: false });

module.exports = model('Dataset', schema);
