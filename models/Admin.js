const { Schema, model } = require('mongoose');
const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  lastFoundUsersEmail: { type: String, default: '' },
}, { versionKey: false });

module.exports = model('Admin', schema);
