const { paymentValidation, paymentModel } = require('../Models/paymentModel');

const paymentGetData = async (req, res, next) => {
    try {
        const getdata = await paymentModel.find()
        res.status(200).send(getdata);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

// get by id
const paymentGetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const paymentGetById = await paymentModel.findById(id)
        if (!paymentGetById)
            return res.status(404).send({ message: 'this payment not found' });
        res.status(200).send(paymentGetById);
    } catch (error) {
        res.status(404).send(error.message);
    }
};
// post the payment
const paymentPost = async (req, res, next) => {
    try {
        const { error } = paymentValidation(req.body)
        if (error) return res.status(400).send(error.message)
        const paymentPosting = new paymentModel(req.body)

        await paymentPosting.save()
        res.status(201).send({
            status: true,
            paymentPosting,
            message: 'succefully inserted '
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};
// put or updated payment
const paymentUpdate = async (req, res, next) => {
    try {
        const paymentUpdating = await paymentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).send({
            status: 'Success',
            message: 'Successfully Updated',
            info: paymentUpdating
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};

// payment delete
const paymentDelete = async (req, res) => {
    try {
        const deletingById = await paymentModel.findByIdAndRemove(req.params.id)
        res.send({ status: 'success', message: `this Payment ${deletingById} is Deleted successfully` })
    } catch (error) {
        error.message
    }

}

module.exports = {
    paymentGetData,
    paymentGetById,
    paymentPost,
    paymentUpdate,
    paymentDelete
};