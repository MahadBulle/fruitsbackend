const mongoose = require('mongoose');
// let joi = require('joi');
const Joi = require('joi');
const ordersSchema = new mongoose.Schema({
    ItemId: {
        type: mongoose.Types.ObjectId,
        ref: 'items',
        required: true
    },
    order_id: {
        type: Number,
        // required: true
    },
    description:{
        type: String,
    },
    order_qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    total_Price: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: new Date,
    },
   


},{timestamps:true});

const ordersModel = mongoose.model('orders', ordersSchema);

// va;iadtion
// function ordersValidation(newSalesOBj) {
//     let ordersVal = joi.object({
//         ItemId: joi.string().required(),
//         order_id: joi.number().required(),
//         order_qty: joi.number().required(),
//         // discount: joi.number().required()
       
//     });
//     return ordersVal.validate(newSalesOBj);
// }
const ordersValidation = (orders) => {
    if (!Array.isArray(orders)) {
      return { error: { message: 'Orders must be an array' } };
    }
  
    const validationSchema = Joi.object({
      ItemId: Joi.string().required(),
      // order_id: Joi.string().required(),
      order_qty: Joi.number().required(),
    });
  
    for (let i = 0; i < orders.length; i++) {
      const { error } = validationSchema.validate(orders[i]);
      if (error) {
        return { error };
      }
    }
  
    return {};
  };
  

module.exports = {
    ordersModel,
    ordersValidation,
};