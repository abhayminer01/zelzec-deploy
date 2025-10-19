const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : String,
    description : String,
    form_data: mongoose.Schema.Types.Mixed,
    images: [
        {
            url: String,
            filename: String,
        },
    ],
    price: Number,
    location: {
        lat : Number,
        lng : Number
    }
}, { timestamps : true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;