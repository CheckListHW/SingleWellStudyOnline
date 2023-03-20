const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stupidPass: { type: String, default: 'unknown' },
  registrationDate: { type: Date, default: Date.now },
  activeUntil: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  datasetId: { type: Number, required: true, default: 0 },
  trace: { type: Types.ObjectId, ref: 'Trace' },
  personalData: { type: Types.ObjectId, ref: 'PersonalData' },
}, { versionKey: false });

module.exports = model('User', schema);
