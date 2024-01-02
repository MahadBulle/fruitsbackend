const mongoose = require('mongoose');
let joi = require('joi');
const paymentController = new mongoose.Schema({
    // customerId: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'customers',
    //     required: true
    // },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: new Date
    },  
   
},{timestamps:true});

const paymentModel = mongoose.model('payment', paymentController);

// va;iadtion
function paymentValidation(paymentOBj) {
    let paymentval = joi.object({
        orderId: joi.string().required(),
        paidAmount: joi.number().required(),
        date: joi.date()
    });
    return paymentval.validate(paymentOBj);
}

module.exports = {
    paymentModel,
    paymentValidation,
};