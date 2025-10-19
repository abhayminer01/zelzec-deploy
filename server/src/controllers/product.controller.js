const Product = require("../models/product.model");
const User = require("../models/user.model");

const createProduct = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      form_data,
      price,
      location,
    } = req.body;

    const images = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    const newProduct = new Product({
      category,
      user : req.user._id,
      title,
      description,
      form_data: JSON.parse(form_data),
      images,
      price,
      location: JSON.parse(location),
    });

    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { products: 1 } });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, err: error.message });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    // Fetch latest 8 products, sorted by creation date (newest first)
    const products = await Product.find()
      .populate('category', 'title icon') // populate category info (optional)
      .populate('user', 'name') // populate user name (optional)
      .sort({ createdAt: -1 })
      .limit(8);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching latest products',
    });
  }
}

module.exports = {
  createProduct,
  getLatestProducts
}
