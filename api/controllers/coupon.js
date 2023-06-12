import Coupon from "../models/coupon";
import User from "../models/user";
import Cart from "../models/cart";

//create
const create = async (req, res) => {
  const { name, expiry, discount } = req.body;
  const coupon = await new Coupon({ name, expiry, discount });
  coupon.save();
  res.json(coupon);
};

const list = async (req, res) => {
  const allCoupon = await Coupon.find({});
  res.json(allCoupon);
};

const remove = async (req, res) => {
  res.json(await Coupon.findByIdAndDelete(req.params.couponId));
};
const applyCoupon = async (req, res) => {
  const { coupon } = req.body;

  const couponCheck = await Coupon.findOne({ name: coupon });

  if (couponCheck == null) {
    res.json({
      err: "Not found coupon",
    });
    return;
  }

  const user = await User.findOne({ email: req.user.email });

  let { products, cartTotal } = await Cart.findOne({
    orderedBy: user?._id,
  }).populate("products.product", "_id title price");

  let totalAfterDiscount = (
    cartTotal *
    ((100 - couponCheck.discount) / 100)
  ).toFixed(2);

  const updateCart = await Cart.findOneAndUpdate(
    { orderedBy: user?._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json({
    message: "ok",
    cart: updateCart,
  });
};
module.exports = {
  create: create,
  list: list,
  remove: remove,
  applyCoupon: applyCoupon,
};
