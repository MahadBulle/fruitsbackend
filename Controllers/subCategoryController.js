const { subCategoryValidation, subCategoryModel } = require('../Models/subCategoryModel');
const { itemsModel } = require('../Models/itemsModel');
const subCategoryGetData = async (req, res, next) => {
  try {
    const getdata = await subCategoryModel.find().populate([{
      path: "categoryId",
      model: "category",
      select: "CategoryName"
    }]);
    res.status(200).send(getdata);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// get by id
const subCategoryGetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subCategoryGetById = await subCategoryModel.findById(id).populate([{
      path: "categoryId",
      model: "category",
      select: "CategoryName"
    }]);
    if (!subCategoryGetById)
      return res.status(404).send({ message: 'this subcategory not found' });
    res.status(200).send(subCategoryGetById);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
// post the subcategory
const subCategoryPost = async (req, res, next) => {
  try {
    const { error } = subCategoryValidation(req.body)
    if (error) return res.status(400).send(error.message)
    const subCategoryPosting = new subCategoryModel(req.body)
    await subCategoryPosting.save()
    res.status(201).send({
      status: true,
      subCategoryPosting,
      message: 'succefully inserted '
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
};
// put or updated subcategory
const subCategoryUpdate = async (req, res, next) => {
  try {
    const subCategoryUpdating = await subCategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).send({
      status: 'Success',
      message: 'Successfully Updated',
      info: subCategoryUpdating
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
};

// subcategory delete

const subCategoryDelete = async (req, res) => {
  try {
    const subCategoryId = req.params.id;


    const itemReference = await itemsModel.findOne({ subCategoryId });

    if (itemReference) {
      return res.status(400).send({ message: 'This subcategory is referenced in Items. Delete that item first.' });
    }


    const deletingById = await subCategoryModel.findByIdAndRemove(subCategoryId);
    res.send({ status: 'success', message: `This Subcategory ${deletingById} is deleted successfully` });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  subCategoryGetById,
  subCategoryPost,
  subCategoryUpdate,
  subCategoryGetData,
  subCategoryDelete
};