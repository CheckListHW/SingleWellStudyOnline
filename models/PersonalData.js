const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  speciality: { type: String, required: true },
  course: { type: String, required: true },
  experience: { type: Number, required: true },
  expectations: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('PersonalData', schema);
