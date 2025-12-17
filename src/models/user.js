import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

userSchema.statics.findUserByEmail = function (email) {
    return this.findOne({ email });
};

userSchema.statics.createUser = async function ({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new this({ username, email, passwordHash });
    return user.save();
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.generateResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return token;
};

userSchema.statics.findByResetToken = function (token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    return this.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
};

userSchema.methods.resetPassword = async function (newPassword) {
    this.passwordHash = await bcrypt.hash(newPassword, 10);
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
    return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
