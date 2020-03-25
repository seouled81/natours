const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.']
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be longer than 8 characters'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
          // this variable doesn't work on update, ONLY WORKS ON CREATE AND SAVE
          return el === this.password;
        },
        message: 'Passwords must match!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user'
});

// Document middleware to encrypt passwords: runs before (or after) .save() and .create()
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Add the password changed at field
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Add a query middleware to filter inactive users
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: true });
  next();
});

// Add a custom method to every User instance
userSchema.methods.checkPWDs = async function(pwd, hash) {
  return await bcrypt.compare(pwd, hash);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return JWTTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 600000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
