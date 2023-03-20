const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  trace: [{ id: Number, text: String }],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('TraceData', schema);
