const mongoose = require('mongoose');
let joi = require('joi');
const itemsSchema = new mongoose.Schema({

    itemname: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    saleprice: {
        type: Number,
        required: true,
    }



},{timestamps:true});

const itemsModel = mongoose.model('items', itemsSchema);

// va;iadtion
function itemValidation(itemOBj) {
    let itemval = joi.object({
        itemname: joi.string().required(),
        description: joi.string().required(),
        saleprice: joi.number().required(),
    });
    return itemval.validate(itemOBj);
}

module.exports = {
    itemsModel,
    itemValidation,
};