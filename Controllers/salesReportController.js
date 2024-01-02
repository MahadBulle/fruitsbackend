const { ordersModel } = require("../Models/ordersModel");

const GetSalesData = async (req, res) => {
  try {
    const getdata = await ordersModel.find()
      .populate({
        path: "ItemId",
        model: "items",
        populate: {
          path: "categoryId",
          model: "category",
          select: "CategoryName",
        },
        
      });

    // Now, getdata will have the populated CategoryName

    res.status(200).send(getdata);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const SpecificSale = async (req, res) => {
  try {
    const category = req.params.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let filter = { "ItemId.categoryId": category };

    if (startDate && endDate) {
      // Add date range filtering if startDate and endDate are provided
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const getdata = await ordersModel
      .find(filter)
      .populate({
        path: "ItemId",
        model: "items",
        populate: {
          path: "categoryId",
          model: "category",
          select: "CategoryName",
        },
      });

    // Now, getdata will have the populated CategoryName

    res.status(200).send(getdata);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const ordersGetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ordersGetById = await ordersModel.findById(id);
    if (!ordersGetById)
      return res.status(404).send({ message: "This order was not found" });
    res.status(200).send(ordersGetById);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.GetSalesData = GetSalesData;
exports.SpecificSale = SpecificSale;
