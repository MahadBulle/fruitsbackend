const mongoose = require('mongoose');
let joi = require('joi');
const customerSchema = new mongoose.Schema({

    customeName: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: Number,
        required: true,
    },
    customerAddress: {
        type: String,
        required: true,
    },
    customerReference: {
        type: String,
        required: true,
    },
    customerDescription: {
        type: String,
        required: true,
    },


},{timestamps:true});

const customerModel = mongoose.model('customers', customerSchema);

// va;iadtion
function customerValidation(customerOBj) {
    let customerval = joi.object({
        customeName: joi.string().required(),
        customerPhone: joi.number().required(),
        customerAddress: joi.string().required(),
        customerReference: joi.string().required(),
        customerDescription: joi.string().required(),

    });
    return customerval.validate(customerOBj);
}

module.exports = {
    customerModel,
    customerValidation,
};