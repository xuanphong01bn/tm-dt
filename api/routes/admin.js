const express = require("express");

const router = express.Router();
import { authCheck, adminCheck } from "../middlewares/auth.js";

import { updateStatus, getAllOrderAdmin } from "../controllers/admin";

router.post(
  "/admin/order-status/:orderId",
  authCheck,
  adminCheck,
  updateStatus
);

router.get("/admin/order", authCheck, adminCheck, getAllOrderAdmin);

module.exports = router;
