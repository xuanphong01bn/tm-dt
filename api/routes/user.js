const express = require("express");

const router = express.Router();
import { authCheck, adminCheck } from "../middlewares/auth.js";

import {
  userCart,
  getUserCart,
  createOrder,
  emptyUserCart,
  getUserOrder,
} from "../controllers/user";

// router.get("/user", (req, res) => {
//   res.json({
//     data: "test",
//   });
// });

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);

router.delete("/user/cart", authCheck, emptyUserCart);

router.post("/user/order", authCheck, createOrder);

router.get("/user/order", authCheck, getUserOrder);

module.exports = router;
