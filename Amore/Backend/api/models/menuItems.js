const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name:String,
    description: String,
    price: Number,
    discount: { type: Number, default: 0 },
    image: { type: String, default: "https://bitsofco.de/content/images/2018/12/broken-1.png"},
    tags: String,
    likes: { type: Number, default: 0 },
    isDeal: { type: Boolean, default: false }
})

module.exports  = new mongoose.model("MenuItems", menuItemSchema)