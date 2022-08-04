const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    image: String,
    isAdmin: { type: Boolean, default: true },
    likedMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItems' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

module.exports  = new mongoose.model("Users", userSchema)