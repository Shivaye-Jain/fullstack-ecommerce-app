import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <motion.div
      className="
        bg-gray-100 dark:bg-[#0f172a]
        min-h-screen
        p-4 sm:p-6 lg:p-8
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔥 Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🛒 LEFT - CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {cart.length === 0 && (
            <div
              className="
                bg-white dark:bg-gray-800
                p-6 rounded-2xl
                shadow-sm dark:shadow-black/30
                text-center
                text-gray-500 dark:text-gray-100
              "
            >
              Your cart is empty
            </div>
          )}

          {cart.map((item) => (
            <motion.div
              key={item.id}
              className="
                bg-white dark:bg-gray-800
                p-5 rounded-2xl
                shadow-sm hover:shadow-2xl
                dark:shadow-black/30
                transition duration-300
                flex flex-col sm:flex-row
                sm:items-center
                justify-between
                gap-5
              "
              whileHover={{ scale: 1.01 }}
            >
              {/* 🖼️ Product Image + Info */}
              <div className="flex items-center gap-4 flex-1">
                
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="
                    w-24 h-24
                    object-contain
                    bg-gray-100 dark:bg-gray-700
                    rounded-xl
                    p-2
                  "
                />

                {/* 📦 Info */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-100 mt-1">
                    ₹{item.price}
                  </p>

                  {/* Subtotal */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Subtotal: ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>

              {/* 🔢 Quantity Controls */}
              <div className="flex items-center gap-3">
                
                <button
                  className="
                    w-9 h-9
                    border border-gray-300 dark:border-gray-600
                    rounded-lg
                    bg-white dark:bg-gray-700
                    text-gray-800 dark:text-white
                    hover:bg-gray-100 dark:hover:bg-gray-600
                    transition
                  "
                  onClick={() => { decreaseQuantity(item);}}
                >
                  -
                </button>

                <span className="font-medium text-gray-800 dark:text-white min-w-[20px] text-center">
                  {item.quantity}
                </span>

                <button
                  className="
                    w-9 h-9
                    border border-gray-300 dark:border-gray-600
                    rounded-lg
                    bg-white dark:bg-gray-700
                    text-gray-800 dark:text-white
                    hover:bg-gray-100 dark:hover:bg-gray-600
                    transition
                  "
                  onClick={() => increaseQuantity(item)}
                >
                  +
                </button>
              </div>

              {/* ❌ Remove */}
              <button
                className="
                  text-red-500 hover:text-red-600
                  dark:text-red-400 dark:hover:text-red-300
                  text-sm font-medium
                  transition
                "
                onClick={() => {removeFromCart(item.id)}}
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>

        {/* 📦 RIGHT - ORDER SUMMARY */}
        <div
          className="
            bg-white dark:bg-gray-800
            p-6 rounded-2xl
            shadow-md dark:shadow-black/30
            h-fit sticky top-6
          "
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Order Summary
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-200">
            
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>

              <span className="text-green-600 dark:text-green-400">
                Free
              </span>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* 🚀 Checkout Button */}
          <Link to="/checkout">
            <motion.button
              className="
                mt-6 w-full
                bg-blue-600 hover:bg-blue-700
                text-white
                py-3 rounded-xl
                font-medium
                transition
                shadow-lg hover:shadow-xl
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Cart;