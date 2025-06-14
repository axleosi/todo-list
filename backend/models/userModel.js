import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema= new mongoose.Schema({
    name: String,
    password:{ type:String, required:true},
    email: { type:String, required:true, unique:true},
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });


const User=mongoose.model('User', userSchema);
export default User