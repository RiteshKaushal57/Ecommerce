// backend/controllers/cartController.js

import UserModal from "../modals/UserModal.js";
// No need to import ProductModel directly here for populate to work,
// as long as ProductModel is defined and exported somewhere in your app.

// Helper function to populate and send cart, reduces redundancy
const sendPopulatedCart = async (user, res) => {
    // IMPORTANT: 'Products' must match the model name you used in mongoose.model('Products', productSchema)
    await user.populate("cart.productId");
    res.json(user.cart);
};

// Get current UserModal's cart
export const getCart = async (req, res) => {
    if (!req.user || !req.user.id) { // Ensure authentication check is done by middleware
        return res.status(401).json({ message: "Unauthorized: User not logged in." });
    }
    try {
        const user = await UserModal.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        await sendPopulatedCart(user, res); // Use the helper
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal Server Error: Could not fetch cart.", error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User not logged in." });
    }

    const { productId, quantity, selectedSize, price } = req.body;

    // Basic validation for incoming data
    if (!productId || quantity === undefined || quantity <= 0 || price === undefined) {
        return res.status(400).json({ message: "Invalid product data provided. productId, quantity, and price are required, and quantity must be positive." });
    }

    try {
        const user = await UserModal.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cartItem = user.cart.find(
            (item) =>
                item.productId.toString() === productId &&
                (item.selectedSize === selectedSize || (!item.selectedSize && !selectedSize))
        );

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            // Push new item to cart. Make sure price is stored at the time of adding.
            user.cart.push({ productId, quantity, selectedSize, price });
        }
        await user.save();
        await sendPopulatedCart(user, res); // Use the helper to send populated cart
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal Server Error: Could not add item to cart.", error: error.message });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User not logged in." });
    }

    const { productId } = req.params; // productId from URL params
    const { quantity, selectedSize } = req.body; // quantity and selectedSize from body

    if (!productId || quantity === undefined || quantity <= 0) {
        return res.status(400).json({ message: "Invalid update data provided. productId, quantity (must be positive), and selectedSize (optional) are required." });
    }

    try {
        const user = await UserModal.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cartItem = user.cart.find(
            (item) =>
                item.productId.toString() === productId &&
                (item.selectedSize === selectedSize || (!item.selectedSize && !selectedSize))
        );

        if (cartItem) {
            cartItem.quantity = quantity;
            await user.save();
            await sendPopulatedCart(user, res); // Use the helper
        } else {
            res.status(404).json({ message: "Cart item not found or size mismatch." });
        }
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Internal Server Error: Could not update cart item.", error: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User not logged in." });
    }

    const { productId } = req.params; // productId from URL params
    const { selectedSize } = req.body; // selectedSize from body for matching

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required to remove from cart." });
    }

    try {
        const user = await UserModal.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const initialCartLength = user.cart.length;
        user.cart = user.cart.filter(
            (item) =>
                !(
                    item.productId.toString() === productId &&
                    (item.selectedSize === selectedSize || (!item.selectedSize && !selectedSize))
                )
        );

        if (user.cart.length === initialCartLength) {
            return res.status(404).json({ message: "Cart item not found to remove (or size/ID mismatch)." });
        }

        await user.save();
        await sendPopulatedCart(user, res); // Use the helper
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Internal Server Error: Could not remove item from cart.", error: error.message });
    }
};