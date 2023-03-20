const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  appPosition: { type: Number },
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('AppPosition', schema);
