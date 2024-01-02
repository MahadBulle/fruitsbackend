const { customerValidation, customerModel } = require('../Models/customersModel');

const customerGetData = async (req, res, next) => {
    try {
        const getdata = await customerModel.find();
        res.status(200).send(getdata);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

// get by id
const customerGetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerGetById = await customerModel.findById(id);
        if (!customerGetById)
            return res.status(404).send({ message: 'this customer not found' });
        res.status(200).send(customerGetById);
    } catch (error) {
        res.status(404).send(error.message);
    }
};
// post the customer
const customerPost = async (req, res, next) => {
    try {
        const { error } = customerValidation(req.body)
        if (error) return res.status(400).send(error.message)
        const customerPosting = new customerModel(req.body)
        await customerPosting.save()
        res.status(201).send({
            status: true,
            customerPosting,
            message: 'succefully inserted '
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};
// put or updated customer
const customerUpdate = async (req, res, next) => {
    try {
        const customerUpdating = await customerModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).send({
            status: 'Success',
            message: 'Successfully Updated',
            info: customerUpdating
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};

// customer delete
const customerDelete = async (req, res) => {
    try {
        const deletingById = await customerModel.findByIdAndRemove(req.params.id)
        res.send({ status: 'success', message: `this Customer ${deletingById} is Deleted successfully` })
    } catch (error) {
        error.message
    }

}

module.exports = {
    customerGetData,
    customerGetById,
    customerPost,
    customerUpdate,
    customerDelete
};