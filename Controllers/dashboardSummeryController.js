const { categoryModel } = require('../Models/categoryModel');
const { itemsModel } = require('../Models/itemsModel');
const {subCategoryModel} = require ('../Models/subCategoryModel')

const getDashboardSummary = async (req, res, next) => {
  try {
    const numberOfCategories = await categoryModel.countDocuments();
    const numberOfSubCategories = await subCategoryModel.countDocuments();
    const numberOfItems = await itemsModel.countDocuments();

    res.status(200).send({
      numberOfCategories,
      numberOfItems,
      numberOfSubCategories
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getDashboardSummary
};
