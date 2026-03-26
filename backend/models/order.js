import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
{
  name: { type: String, required: true },

  qty: { type: Number, required: true },

  image: { type: String, required: true },

  price: { type: Number, required: true },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  selectedColor: {
    name: String,
    hex: String
  },
  selectedStorage: {
    size: String,
    priceAdd: Number
  }
},
{ _id: false }
);

const orderSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
     isReviewed: { type: Boolean, default: false },
  },

  paymentMethod: {
    type: String,
    required: true,
  },

  itemsPrice: {
    type: Number,
    required: true,
  },

  shippingPrice: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  paidAt: {
    type: Date,
  },

  isConfirmed: {
    type: Boolean,
    default: false,
  },

  confirmedAt: {
    type: Date,
  },

  isShipped: {
    type: Boolean,
    default: false,
  },

  shippedAt: {
    type: Date,
  },

  isDelivered: {
    type: Boolean,
    default: false,
  },

  deliveredAt: {
    type: Date,
  },

  isCancelled: {
    type: Boolean,
    default: false,
  },

  cancelledAt: {
    type: Date,
  },
  
  expectedDeliveryDate: {
    type: Date,
  },

},
{
  timestamps: true,
}
);

const order = mongoose.model("order", orderSchema);

export default order;