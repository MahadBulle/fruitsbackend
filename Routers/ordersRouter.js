const express = require('express')
const router = express.Router()

const ordersController = require('../Controllers/ordersController')

const Invoice = require('../Models/invoiceModel');
const { itemsModel } = require('../Models/itemsModel');
const { ordersModel } = require('../Models/ordersModel')

// Route for retrieving the latest invoice generated after order posting
router.get('/latest-invoice', async (req, res) => {
  try {
    const latestInvoice = await Invoice.findOne().sort({ $natural: -1 }).limit(1);
    if (!latestInvoice) {
      return res.status(404).send({ message: 'No invoices found' });
    }
    res.status(200).send(latestInvoice);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for retrieving all invoices
router.get('/all-invoices', async (req, res) => {
  try {
    const allInvoices = await Invoice.find();
    if (!allInvoices || allInvoices.length === 0) {
      return res.status(404).send({ message: 'No invoices found' });
    }
    res.status(200).send(allInvoices);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Inside your existing router setup

const moment = require('moment');


// Route for retrieving today's invoices
router.get('/today-invoices', async (req, res) => {
  try {
    const todayStart = moment().startOf('day'); // Get the start of the current day
    const todayEnd = moment().endOf('day'); // Get the end of the current day

    const todayInvoices = await Invoice.find({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    if (!todayInvoices || todayInvoices.length === 0) {
      return res.status(404).send({ message: 'No invoices found for today' });
    }

    res.status(200).send(todayInvoices);
  } catch (error) {
    res.status(500).send(error.message);
  }
});




router.get('/', ordersController.ordersGetData)


// router.get('/invoice', ordersController.ordersInvoice)

router.get('/:id', ordersController.ordersGetById)

router.get('/orderlist/:id', ordersController.OrderIDListitems)

router.post('/', ordersController.ordersPost)

// router.put('/:id', ordersController.ordersPut)

router.delete('/:id', ordersController.ordersDelete)

router.delete('/invoice/:id', ordersController.deleteInvoice)

router.delete('/invoice/:OrderId/orders/:ItemId', async (req, res) => {
  try {
    const { OrderId, ItemId } = req.params;

    const invoiceka = await Invoice.find()
    console.log(invoiceka)

    const invoice =  invoiceka.find(invoice=>invoice.orders.order_id.toString()===OrderId);
    if (!invoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    // Find the item in the invoice using ItemId
    const orderIndex = invoice.orderedItems.findIndex(order => order.ItemId.toString() === ItemId);

    if (orderIndex === -1) {
      return res.status(404).send({ message: "Item not found in the invoice" });
    }

    const orderToDelete = invoice.orderedItems[orderIndex];
    const orderIdToDelete = orderToDelete._id.toString();

    // Remove the item from the orderedItems array in the invoice
    invoice.orderedItems.splice(orderIndex, 1);

    // Update the total orders, quantity, and price in the invoice
    const updatedTotalOrders = invoice.orderedItems.length;
    const updatedTotalQuantity = invoice.orders.totalQuantity - orderToDelete.order_qty;
    let updatedTotalPrice = invoice.orders.totalPrice;
    updatedTotalPrice -= orderToDelete.total_Price;

    invoice.orders = {
      order_id: invoice.orders.order_id,
      totalOrders: updatedTotalOrders,
      totalQuantity: updatedTotalQuantity,
      totalPrice: updatedTotalPrice,
    };

    // Check if orderedItems is empty, then delete the invoice
    if (invoice.orderedItems.length === 0) {
      await Invoice.findOneAndDelete({'orderedItems.ItemId':ItemId,'orders.order_id':OrderId});
    } else {
      // If orderedItems is not empty, continue with the update
      invoice.orderedItems = invoice.orderedItems.filter(
        (orderedItem) => orderedItem._id.toString() !== orderIdToDelete
      );
      await invoice.save();
    }

    // Find and delete the specific order from the ordersModel collection using ItemId
    const selectedItem = await ordersModel.findOneAndDelete({ ItemId: ItemId,order_id:OrderId });
    console.log("Deleted", selectedItem);

    // Refill the data back to the item store
    const item = await itemsModel.findById(orderToDelete.ItemId);
    if (!item) {
      return res.status(404).send({ message: `Item ${orderToDelete.ItemId} not found` });
    }

    item.quantity += orderToDelete.order_qty;
    await item.save();

    res.status(200).send({ message: "Item deleted from invoice, orders, and item store updated" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});



router.put('/invoice/:OrderId/orders/:ItemId', async (req, res) => {
  try {
    const { OrderId, ItemId } = req.params;
    const { order_qty: newOrderQty } = req.body;
    console.log(OrderId)

    const invoiceka = await Invoice.find()
    console.log(invoiceka)

    const invoice =  invoiceka.find(invoice=>invoice.orders.order_id.toString()===OrderId);
    if (!invoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    const orderToUpdate = invoice.orderedItems.find(order => order.ItemId.toString() === ItemId);
    if (!orderToUpdate) {
      return res.status(404).send({ message: "Item not found in the invoice" });
    }
//Getting Itemes
    const prevOrderQty = orderToUpdate.order_qty;
    const item = await itemsModel.findById(ItemId);
    if (!item) {
      return res.status(404).send({ message: `Item ${ItemId} not found` });
    }

    // If the order_qty is increased
    if (newOrderQty > prevOrderQty) {
      const quantityDiff = newOrderQty - prevOrderQty;
      if (item.quantity < quantityDiff) {
        return res.status(400).send({ message: "Insufficient quantity in the item store" });
      }
      item.quantity -= quantityDiff; // Decrease the item store quantity
      orderToUpdate.order_qty = newOrderQty;
    } else if (newOrderQty < prevOrderQty) { // If the order_qty is decreased
      const quantityDiff = prevOrderQty - newOrderQty;
      item.quantity += quantityDiff; // Increase the item store quantity
      orderToUpdate.order_qty = newOrderQty;
    } else {
      return res.status(400).send({ message: "No change in order quantity" });
    }

    await item.save(); // Save the updated item quantity

    // Update the total quantity and price in the invoice
    const priceDifference = (newOrderQty - prevOrderQty) * orderToUpdate.price;

    const updatedTotalQuantity = invoice.orders.totalQuantity + (newOrderQty - prevOrderQty);
    let updatedTotalPrice = invoice.orders.totalPrice;

    if (!isNaN(priceDifference)) {
      updatedTotalPrice += priceDifference;
    } else {
      console.error('Price difference is not a number:', priceDifference);
    }

    invoice.orders = {
      order_id: invoice.orders.order_id,
      totalOrders: invoice.orderedItems.length,
      totalQuantity: updatedTotalQuantity,
      totalPrice: updatedTotalPrice,
    };

    await invoice.save();

    const forprice = await ordersModel.findOne({"ItemId":ItemId, "order_id":OrderId})
    const ordersUpdateResult = await ordersModel.findOneAndUpdate(
      { "ItemId":ItemId,"order_id":OrderId}, // Query condition to match the correct document
      { $set: {
         order_qty: newOrderQty,
         total_Price: newOrderQty*forprice.price
       } },
       {new : true}
    );

    // console.log("Query",ordersUpdateResult)
   

    res.status(200).send({ message: "Order quantity updated, item store quantity adjusted, and invoice updated" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// const mongoose = require('mongoose');

// router.delete('/invoice/:OrderId/orders/:ItemId', async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     await session.withTransaction(async () => {
//       const { OrderId, ItemId } = req.params;

//       const invoice = await Invoice.findById(OrderId);
//       if (!invoice) {
//         return res.status(404).send({ message: "Invoice not found" });
//       }

//       const orderIndex = invoice.orderedItems.findIndex(order => order.ItemId.toString() === ItemId);

//       if (orderIndex === -1) {
//         return res.status(404).send({ message: "Item not found in the invoice" });
//       }

//       const orderToDelete = invoice.orderedItems[orderIndex];
//       const orderIdToDelete = orderToDelete._id.toString();

//       invoice.orderedItems.splice(orderIndex, 1);

//       const updatedTotalOrders = invoice.orderedItems.length;
//       const updatedTotalQuantity = invoice.orders.totalQuantity - orderToDelete.order_qty;
//       let updatedTotalPrice = invoice.orders.totalPrice;
//       updatedTotalPrice -= orderToDelete.total_Price;

//       invoice.orders = {
//         order_id: invoice.orders.order_id,
//         totalOrders: updatedTotalOrders,
//         totalQuantity: updatedTotalQuantity,
//         totalPrice: updatedTotalPrice,
//       };

//       if (invoice.orderedItems.length === 0) {
//         await Invoice.findByIdAndDelete(OrderId);
//       } else {
//         invoice.orderedItems = invoice.orderedItems.filter(
//           (orderedItem) => orderedItem._id.toString() !== orderIdToDelete
//         );
//         await invoice.save();
//       }

//       const selectedItem = await ordersModel.findOneAndDelete({ ItemId: ItemId });
//       console.log("Deleted", selectedItem);

//       const item = await itemsModel.findById(orderToDelete.ItemId);
//       if (!item) {
//         return res.status(404).send({ message: `Item ${orderToDelete.ItemId} not found` });
//       }

//       item.quantity += orderToDelete.order_qty;
//       await item.save();

//       res.status(200).send({ message: "Item deleted from invoice, orders, and item store updated" });
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).send(error.message);
//   } finally {
//     session.endSession();
//   }
// });

// router.put('/invoice/:OrderId/orders/:ItemId', async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     await session.withTransaction(async () => {
//       const { OrderId, ItemId } = req.params;
//       const { order_qty: newOrderQty } = req.body;

//       const invoice = await Invoice.findById(OrderId);
//       if (!invoice) {
//         return res.status(404).send({ message: "Invoice not found" });
//       }

//       const orderToUpdate = invoice.orderedItems.find(order => order.ItemId.toString() === ItemId);
//       if (!orderToUpdate) {
//         return res.status(404).send({ message: "Item not found in the invoice" });
//       }

//       const prevOrderQty = orderToUpdate.order_qty;
//       const item = await itemsModel.findById(ItemId);
//       if (!item) {
//         return res.status(404).send({ message: `Item ${ItemId} not found` });
//       }

//       if (newOrderQty > prevOrderQty) {
//         const quantityDiff = newOrderQty - prevOrderQty;
//         if (item.quantity < quantityDiff) {
//           return res.status(400).send({ message: "Insufficient quantity in the item store" });
//         }
//         item.quantity -= quantityDiff;
//         orderToUpdate.order_qty = newOrderQty;
//       } else if (newOrderQty < prevOrderQty) {
//         const quantityDiff = prevOrderQty - newOrderQty;
//         item.quantity += quantityDiff;
//         orderToUpdate.order_qty = newOrderQty;
//       } else {
//         return res.status(400).send({ message: "No change in order quantity" });
//       }

//       await item.save();

//       const priceDifference = (newOrderQty - prevOrderQty) * orderToUpdate.price;

//       const updatedTotalQuantity = invoice.orders.totalQuantity + (newOrderQty - prevOrderQty);
//       let updatedTotalPrice = invoice.orders.totalPrice;

//       if (!isNaN(priceDifference)) {
//         updatedTotalPrice += priceDifference;
//       } else {
//         console.error('Price difference is not a number:', priceDifference);
//       }

//       invoice.orders = {
//         order_id: invoice.orders.order_id,
//         totalOrders: invoice.orderedItems.length,
//         totalQuantity: updatedTotalQuantity,
//         totalPrice: updatedTotalPrice,
//       };

//       await invoice.save();

//       const forprice = await ordersModel.findOne({"ItemId":ItemId})
//       const ordersUpdateResult = await ordersModel.findOneAndUpdate(
//         { "ItemId": ItemId },
//         { $set: {
//            order_qty: newOrderQty,
//            total_Price: newOrderQty*forprice.price
//          } },
//         { new: true }
//       );

//       console.log("Query", ordersUpdateResult);

//       res.status(200).send({ message: "Order quantity updated, item store quantity adjusted, and invoice updated" });
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).send(error.message);
//   } finally {
//     session.endSession();
//   }
// });



module.exports = router
