const mongoose = require('mongoose');
let joi = require('joi');
const categorySchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
  }
},{timestamps:true});

const categoryModel = mongoose.model('category', categorySchema);

// va;iadtion
function categoryValidation(categoryOBj) {
  let categoryval = joi.object({
    CategoryName: joi.string().required(),
  });
  return categoryval.validate(categoryOBj);
}

module.exports = {
  categoryModel,
  categoryValidation,
};