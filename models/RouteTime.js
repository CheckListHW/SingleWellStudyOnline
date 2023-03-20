const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
  data: [{ tracePoint: String, time: Number }],
  user: { type: Types.ObjectId, ref: 'User', unique: true },
}, { versionKey: false });

module.exports = model('RouteTime', schema);
