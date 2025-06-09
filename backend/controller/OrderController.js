import AddressModel from "../modals/AddressModel.js";
import OrderModel from "../modals/OrderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, address } = req.body;
    const userId = req.user.id
    // Save new address
    const newAddress = new AddressModel({ ...address, userId });
    const savedAddress = await newAddress.save();

    // Create order referencing addressId
    const newOrder = new OrderModel({
      userId,
      addressId: savedAddress._id,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
      orderStatus: "processing"
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order placed", orderId: newOrder._id });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // set by isAuthenticated middleware

    // Find orders for this user, populate items.productId and addressId
    const orders = await OrderModel.find({ userId })
      .populate("items.productId") // get product details
      .populate("addressId");      // get address details

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};