import Category from "../models/category";
import Cart from "../models/cart";
import Product from "../models/product";
import User from "../models/user";
import Order from "../models/order";

const updateStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const status = req.body.status;
  let orderChose = await Order.findOneAndUpdate(
    { _id: orderId },
    { orderStatus: status },
    { new: true }
  );

  if (!orderChose) res.json({ update: false });
  else res.json({ update: true, orderChose });
};

const getAllOrderAdmin = async (req, res) => {
  const userOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("products.product");
  res.json(userOrders);
};

module.exports = {
  updateStatus: updateStatus,
  getAllOrderAdmin: getAllOrderAdmin,
};
