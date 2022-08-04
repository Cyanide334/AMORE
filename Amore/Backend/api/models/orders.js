const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    menuItems: [
        {
            item:{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItems' },
            count:Number
    }
],
    status: String,
    date: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    price: Number,
})

module.exports  = new mongoose.model("Orders", orderSchema)