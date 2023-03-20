const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: [{ appPosition: String, base64Image: String }],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('Screenshot', schema);
