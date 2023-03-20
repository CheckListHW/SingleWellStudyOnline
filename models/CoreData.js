const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: [{ id: Number, depth: Number, porosity: Number, waterSaturation: Number, permability: Number, isVisible: Boolean }],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('CoreData', schema);
