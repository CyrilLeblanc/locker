
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.statics.createUser = async function({ username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new this({ username, email, passwordHash });
  return user.save();
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
