import ProductModel from "../modals/ProductModel.js";


export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});

    if (!products)
      return res
        .status(400)
        .json({ success: false, message: "No product found" });

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching all products in backend",
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "No product found" });

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product by id in backend",
    });
  }
};
