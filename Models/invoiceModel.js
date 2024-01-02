const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  numberOfInvoice: {
    type: Number,
    required: true,
    unique: true,
  },
  orders: {
    order_id: {
      type: String,
      required: true,
    },
    totalOrders: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  orderedItems: [ // New field to hold detailed order information
    {
      ItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items', // Reference to the items collection
      },
      order_qty: {
        type: Number,
        required: true,
      },
      description: String,
      price: Number,
      total_Price: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to delete an invoice by ID
InvoiceSchema.statics.deleteInvoiceById = async function (invoiceId) {
  try {
    const result = await this.deleteOne({ _id: invoiceId });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
