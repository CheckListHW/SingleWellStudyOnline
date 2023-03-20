const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: { type: String, required: true, default: '{}' },
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('CurvesExpressions', schema);