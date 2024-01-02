const { ordersValidation, ordersModel } = require("../Models/ordersModel");
const { itemsModel } = require("../Models/itemsModel");
const mongoose = require('mongoose');

const ordersGetData = async (req, res, next) => {
  try {
    const getdata = await ordersModel.find().populate({
      path: "ItemId",
      model: "items",
      populate: {
        path: "categoryId",
        model: "category",
        select: "CategoryName"
      }
    });
    res.status(200).send(getdata);
  } catch (error) {
    res.status(404).send(error.message);
  }
};


const ordersPost = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = ordersValidation(req.body);
    if (error) return res.status(400).send(error.message);

    let maxInvoice = await Invoice.findOne({}, {}, { sort: { numberOfInvoice: -1 } });
    let nextInvoiceNumber = 1;

    if (maxInvoice) {
      nextInvoiceNumber = maxInvoice.numberOfInvoice + 1;
    }

    const orderId = Math.floor(Math.random() * 90000) + 10000;

    const itemIds = req.body.map(order => order.ItemId);
    const itemData = await itemsModel.find({ _id: { $in: itemIds } }).session(session);

    if (itemData.length !== itemIds.length) {
      return res.send("One or more item IDs not found");
    }

    let totalPrice = 0; // Initialize total price

    const orderedItems = []; // Create an array to hold detailed order information

    for (let i = 0; i < req.body.length; i++) {
      const order = req.body[i];
      const currentItemData = itemData.find(item => item._id.toString() === order.ItemId);

      if (currentItemData.quantity < order.order_qty) {
        return res.send(`Insufficient quantity for order ${i + 1}`);
      }

      const updatedQty = currentItemData.quantity - parseInt(order.order_qty);
      order.order_id = orderId.toString();
      order.description = currentItemData.description;
      order.price = currentItemData.buyingprice;
      order.total_Price = currentItemData.buyingprice * order.order_qty;

      // Calculate total price for each order and accumulate
      totalPrice += order.total_Price;

      // Create an object with detailed order information
      const detailedOrder = {
        ItemId: currentItemData._id,
        order_qty: order.order_qty,
        description: currentItemData.description,
        price: currentItemData.buyingprice,
        total_Price: currentItemData.buyingprice * order.order_qty,
      };

      // Push the detailed order into the orderedItems array
      orderedItems.push(detailedOrder);
    }

    const ordersData = req.body.map(order => new ordersModel(order));
    const insertedOrders = await ordersModel.insertMany(ordersData, { session });

    for (let i = 0; i < itemData.length; i++) {
      const currentItemData = itemData[i];
      const ordersQty = req.body[i].order_qty;
      currentItemData.quantity -= ordersQty;
      await currentItemData.save();
    }

    // Create the invoice with the calculated total price and detailed order information
    const totalQuantity = req.body.reduce((total, order) => total + parseInt(order.order_qty), 0);
    const invoiceData = new Invoice({
      numberOfInvoice: nextInvoiceNumber,
      orders: {
        order_id: orderId.toString(),
        totalOrders: req.body.length,
        totalQuantity,
        totalPrice, // Assign the calculated total price
      },
      orderedItems, // Add the detailed order information to the orderedItems field
    });

    await invoiceData.save();
    await session.commitTransaction();

    res.status(201).send({
      status: true,
      message: 'Successfully inserted orders',
      insertedOrders,
      invoice: invoiceData,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).send(error.message);
  } finally {
    session.endSession();
  }
};






const ordersDelete = async (req, res) => {
  try {
    const deletingById = await ordersModel.findByIdAndRemove(req.params.id);
    res.send({
      status: "success",
      message: `This order ${deletingById} was deleted successfully`,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = {
  ordersGetById,
  ordersPost,
  ordersGetData,
  ordersDelete,
  OrderIDListitems,
  deleteInvoice,

};
