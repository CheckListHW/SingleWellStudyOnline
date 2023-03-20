const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: [{ name: String, value: Number, comment: String, fileUrl: String }],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('BasicParameters', schema);
