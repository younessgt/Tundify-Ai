const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Create a user schema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      trim: true,
    },
    status: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dj7k9b8ps/image/upload/v1627474614/avatars/avatar-1_rinevz.png",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,

      // select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === (this.password || this.get("password"));
        },
        message: "Passwords are not the same",
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    collection: "users",
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

// Create a model
const User = mongoose.model("User", userSchema);

module.exports = User;
