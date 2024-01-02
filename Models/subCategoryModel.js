const mongoose = require('mongoose');
let joi = require('joi');
const subCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: 'category',
    required: true
  },
  subCategoryName: {
    type: String,
    required: true,
  }
},{timestamps:true});

const subCategoryModel = mongoose.model('subcategory', subCategorySchema);

// va;iadtion
function subCategoryValidation(subCategoryOBj) {
  let subCategoryval = joi.object({
    categoryId: joi.string().required(),
    subCategoryName: joi.string().required(),
  });
  return subCategoryval.validate(subCategoryOBj);
}

module.exports = {
  subCategoryModel,
  subCategoryValidation,
};