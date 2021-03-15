const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: "Name is required!",
      },
      email: {
        type: String,
        required: "Email is required!",
      },
      password: {
        type: String,
        required: "Password is required!",
      },
      about: {
        type: String,
        required: "About is required!",
      },
      city: {
        type: String,
        required: "City is required!",
      },
      avatarPhoto: {
        data: Buffer,
        contentType: String,
      }
    },
    {
      timestamps: true,
    }
)

module.exports = mongoose.model("User", userSchema)