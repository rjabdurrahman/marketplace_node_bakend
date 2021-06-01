const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    default: '------------',
    required: false
  },
  title: {
    required: false,
    type: String
  },
  description: {
    type: String,
    required: false
  },
  social: {
    linkedIn: {
      type: String,
      required: false
    }
  },
  skills: {
    type: [{
      type: String
    }],
    required: false
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);