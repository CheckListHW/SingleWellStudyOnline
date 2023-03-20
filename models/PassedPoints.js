const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: [String],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('PassedPoints', schema);
