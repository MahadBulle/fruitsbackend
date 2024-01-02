const { categoryValidation, categoryModel } = require('../Models/categoryModel');
const { subCategoryModel } = require('../Models/subCategoryModel');
const { itemsModel } = require('../Models/itemsModel');

const categoryGetData = async (req, res, next) => {
  try {
    const getdata = await categoryModel.find();
    res.status(200).send(getdata);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// get by id
const categoryGetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryGetById = await categoryModel.findById(id);
    if (!categoryGetById)
      return res.status(404).send({ message: 'this category not found' });
    res.status(200).send(categoryGetById);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
// post the category
const categoryPost = async (req, res, next) => {
  try {
    const { error } = categoryValidation(req.body)
    if (error) return res.status(400).send(error.message)
    const categoryPosting = new categoryModel(req.body)
    await categoryPosting.save()
    res.status(201).send({
      status: true,
      categoryPosting,
      message: 'succefully inserted '
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
};
// put or updated category
const categoryUpdate = async (req, res, next) => {
  try {
    const categoryUpdating = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).send({
      status: 'Success',
      message: 'Successfully Updated',
      info: categoryUpdating
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
};

// category delete

const categoryDelete = async (req, res) => {
  try {
    const categoryId = req.params.id;

    
    const subcategoryReference = await subCategoryModel.findOne({ categoryId });

  
    const itemReference = await itemsModel.findOne({ categoryId });

    if (subcategoryReference || itemReference) {
      return res.status(400).send({ message: 'This category is referenced in Subcategories or Items.' });
    }

    
    const deletingById = await categoryModel.findByIdAndRemove(categoryId);
    res.send({ status: 'success', message: `This Category ${deletingById} is deleted successfully` });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  categoryGetData,
  categoryGetById,
  categoryPost,
  categoryUpdate,
  categoryDelete
};