const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import {
  create,
  listAll,
  remove,
  getProductBySlug,
  updateProduct,
  list,
  productStar,
  searchFilter,
} from "../controllers/product";

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.post("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", getProductBySlug);
router.put("/product/update/:slug", authCheck, adminCheck, updateProduct);
router.put("/product/star/:productId", authCheck, productStar);
// filter
router.post("/product/search/filter", searchFilter);
// product paginations
router.post("/products", list);
module.exports = router;
