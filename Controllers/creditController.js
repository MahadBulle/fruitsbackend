const { creditValidation, creditModel } = require('../Models/creditModel');

const creditGetData = async (req, res, next) => {
    try {
        const getdata = await creditModel.find().populate([{
            path: "customerId",
            model: "customers",
            select: "customeName"
        }]);
        res.status(200).send(getdata);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

// get by id
const creditGetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const creditGetById = await creditModel.findById(id).populate([{
            path: "customerId",
            model: "customers",
            select: "customeName"
        }]);
        if (!creditGetById)
            return res.status(404).send({ message: 'this credit not found' });
        res.status(200).send(creditGetById);
    } catch (error) {
        res.status(404).send(error.message);
    }
};
// post the credit
const creditPost = async (req, res, next) => {
    try {
        const { error } = creditValidation(req.body)
        if (error) return res.status(400).send(error.message)
        const creditPosting = new creditModel(req.body)
        let creditData = await creditModel.findOne({_id:req.body.CreditID});
        let currentbalance = creditModel.Balance = req.body.creditAmount;
        console.log(currentbalance)

        await creditModel.findByIdAndUpdate(req.body.CreditID,{
            Balance:currentbalance
           },{new:true});

        await creditPosting.save()
        res.status(201).send({
            status: true,
            creditPosting,
            message: 'succefully inserted '
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};
// put or updated credit
const creditUpdate = async (req, res, next) => {
    try {
        const creditUpdating = await creditModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).send({
            status: 'Success',
            message: 'Successfully Updated',
            info: creditUpdating
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
};

// credit delete
const creditDelete = async (req, res) => {
    try {
        const deletingById = await creditModel.findByIdAndRemove(req.params.id)
        res.send({ status: 'success', message: `this Credit ${deletingById} is Deleted successfully` })
    } catch (error) {
        error.message
    }

}

module.exports = {
    creditGetData,
    creditGetById,
    creditPost,
    creditUpdate,
    creditDelete
};