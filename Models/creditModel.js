const mongoose = require('mongoose');
let joi = require('joi');
const creditSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    creditAmount: {
        type: Number,
        required: true,
    },
    paidAmount:{
        type:Number,
        default:0
    },
    creditDescription: {
        type: String,
        required: true,
    },
    creditDate: {
        type: Date,
        default: new Date
    },
    Balance:{
        type:Number,
        default:0,
    },
},{timestamps:true});

const creditModel = mongoose.model('credit', creditSchema);

// va;iadtion
function creditValidation(creditOBj) {
    let creditval = joi.object({
        customerId: joi.string().required(),
        creditAmount: joi.number().required(),
        creditDescription: joi.string().required(),
        creditDate: joi.date(),
        Balance: joi.number()
    });
    return creditval.validate(creditOBj);
}

module.exports = {
    creditModel,
    creditValidation,
};