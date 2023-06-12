import Product from "../models/product";
import slugify from "slugify";
import User from "../models/user";
import moment from "moment";
const create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error.message,
    });
  }
};

const listAll = async (req, res) => {
  try {
    const allProduct = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort({ createdAt: "desc" });
    res.status(200).json(allProduct);
  } catch (error) {
    res.json({
      err: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Create delete failed");
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.find({ slug: req.params.slug })
      .populate("subs")
      .populate("category");
    res.json(product);
  } catch (error) {
    res.json({
      err: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productUpdate = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body
    );
    res.json(productUpdate);
  } catch (error) {
    res.json({ err: error.message });
  }
};

const list = async (req, res) => {
  try {
    //sort: createAt/updateAt     .order:desc/asc:
    const { sort, order, page, perPage } = req.query;
    console.log(req.query);
    const currentPage = page || 1;
    const per = perPage || 5;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort({ [sort]: order })
      .limit(per);

    res.json(products);
  } catch (error) {
    res.json(error);
  }
};

const productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  console.log("product----- :", product);
  const user = await User.findOne({ email: req.user.email });
  const { star, comment } = req.body;
  console.log("user :", user);
  //check if user da rate chua
  console.log("Checkkkkk user -------:", user._id.toString());
  let existRating = product?.ratings.find(
    (e) => e.postedBy == user._id.toString()
  );
  console.log("exist rating :", existRating);
  if (!!existRating) {
    let ratingUpdate = await Product.updateOne(
      {
        ratings: { $elemMatch: existRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.timeRating": moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      {
        new: true,
      }
    ).exec();
    const updatedProduct = await Product.findOne({
      ratings: { $elemMatch: existRating },
    });
    console.log("update star");
    res.json(ratingUpdate);
  } else {
    let ratingAdd = await Product.findByIdAndUpdate(
      product?._id,
      {
        $push: {
          ratings: {
            star,
            postedBy: user._id,
            name: user?.name,
            comment,
            timeRating: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      },
      {
        new: true,
      }
    );
    console.log("add star");

    res.json(ratingAdd);
  }
};
const handleQuery = async (req, res, body) => {
  // const result = await Product.createIndex({ description: "text" });
  // console.log(`Index created: ${result}`);
  const { text, price } = body;
  console.log("price :", price);
  const filterObject = {
    $text: { $search: text },
    price: {
      $gte: price?.[0],
      $lte: price?.[1],
    },
  };
  if (text == undefined || text.length == 0) delete filterObject.$text;
  if (price == undefined) delete filterObject.price;
  console.log("filter object :", filterObject);
  const products = await Product.find(filterObject)
    .populate("category", "_id name")
    .populate("subs", "_id name")
    // .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const searchFilter = async (req, res) => {
  // const { query } = req.body;
  if (req.body) {
    // console.log("query :", query);
    await handleQuery(req, res, req.body);
  }
};
module.exports = {
  create: create,
  listAll: listAll,
  remove: remove,
  getProductBySlug: getProductBySlug,
  updateProduct: updateProduct,
  list: list,
  productStar: productStar,
  searchFilter,
};
