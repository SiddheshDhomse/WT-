const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true
        },
        productPrice: {
            type: Number,
            required: true
        },
        productId: {
            type: Number
        },
        productUrl: {
            type: String
        }
    }
);


productSchema.plugin(AutoIncrement, { inc_field: 'productId', start_seq: 1 });

module.exports = mongoose.model('Products', productSchema);
