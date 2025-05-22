import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName:{ type: String, required: true},
  lastName:{type: String, required: true},
  email: {type: String, unique: true, lowercase: true, trim: true, required: [true, 'Email is required']},
  password: { type: String, required: [true, 'Password is required'], minLength: [6, 'Password must at least be 6 characters long'] },
  cartItems: [{
    quantity: { type: Number, default: 1},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
  }],
  role: { type: String, enum: ['customer', 'admin'], default: 'customer'}
}, {timestamps: true});



// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



export const User = mongoose.model('User', userSchema);

