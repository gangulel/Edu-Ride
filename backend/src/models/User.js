import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    required: true,
    enum: ['student', 'driver', 'parent'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'pending'
  },
  // Driver-specific fields
  vehicle: {
    type: String,
    default: null
  },
  route: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  trips: {
    type: Number,
    default: 0
  },
  // Parent-specific fields
  children: {
    type: Number,
    default: 0
  },
  complaints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);

export default User;
