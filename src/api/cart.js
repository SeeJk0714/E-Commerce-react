//get cart items
export const getCartItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart ? cart : [];
};

//add product to cart
export const addToCart = (product) => {
    //get all the items from the current cart
    const cart = getCartItems();
    //find if the product already exists in the cart or not
    const existing_product = cart.find((i) => i._id === product._id);
    //if product exists, increase the quantity
    if (existing_product) {
        existing_product.quantity++;
    } else {
        //add product to cart
        cart.push({
            ...product, // clone the product data
            quantity: 1, //set quantity to 1
        });
    }

    //update cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
};

//remove product from cart
export const removeItemFromCart = (product) => {
    const cart = getCartItems();
    const deleteCart = cart.filter((c) => c._id !== product);

    localStorage.setItem("cart", JSON.stringify(deleteCart));
};
