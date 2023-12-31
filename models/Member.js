const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Other fields related to a member
});

// Pre-save hook to hash the password before saving to the database
memberSchema.pre('save', async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare the provided password with the stored hashed password
memberSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
  } catch (error) {
    return false;
  }
};

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

module.exports = Member;
