const { itemValidation, itemsModel } = require('../Models/itemsModel');

const itemsGetData = async (req, res, next) => {
    try {
        const getdata = await itemsModel.find()
        res.status(200).send(getdata);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

// get by id
const itemGetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const itemGetById = await itemsModel.findById(id)
        if (!itemGetById)
            return res.status(404).send({ message: 'this item not found' });
        res.status(200).send(itemGetById);
    } catch (error) {
        res.status(404).send(error.message);
    }
};
// post the item
const itemPost = async (req, res, next) => {
    try {
        const { error } = itemValidation(req.body)
        if (error) return res.status(400).send(error.message)
        const itemPosting = new itemsModel(req.body)

        
        await itemPosting.save()
        res.status(201).send({
            status: true,
            itemPosting,
            message: 'succefully inserted '
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};
// put or updated items
const itemUpdate = async (req, res, next) => {
    try {
        const itemUpdating = await itemsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })


        res.status(200).send({
            status: 'Success',
            message: 'Successfully Updated',
            info: itemUpdating
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};
// put or updated items


// items delete
const itemDelete = async (req, res) => {
    try {
        const deletingById = await itemsModel.findByIdAndRemove(req.params.id)
        res.send({ status: 'success', message: `this Item ${deletingById} is Deleted successfully` })
    } catch (error) {
        error.message
    }

}

module.exports = {
    itemGetById,
    itemPost,
    itemUpdate,
    itemsGetData,
    itemDelete
};