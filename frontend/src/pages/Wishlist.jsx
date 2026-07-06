import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { WishlistContext } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist=[], toggleWishlist } = useContext(WishlistContext);

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
        Wishlist
      </h1>

      {/* ❌ Empty Wishlist */}
      {wishlist.length === 0 ? (
        <div
          className="
            bg-white dark:bg-gray-800
            p-6 rounded-2xl
            shadow-sm dark:shadow-black/30
            text-gray-500 dark:text-gray-300
          "
        >
          No wishlist items yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <motion.div
                className="
                  relative
                  bg-white dark:bg-gray-800
                  rounded-2xl
                  overflow-hidden
                  shadow-sm hover:shadow-2xl
                  dark:shadow-black/30
                  transition duration-300
                "
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* ❤️ Remove Wishlist */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="
                  absolute top-3 right-3
                  text-2xl z-10
                  bg-white/80 dark:bg-gray-900/80
                  backdrop-blur-md
                  rounded-full
                  w-10 h-10
                  flex items-center justify-center
                  shadow-md
                "
                >
                  ❤️
                </button>

                {/* 🖼️ Product Image */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="
                    h-52 w-full
                    object-contain
                    bg-white dark:bg-gray-800
                    p-4
                    transition duration-300
                    hover:scale-105
                  "
                />

                {/* 📦 Content */}
                <div className="p-5">
                  {/* Category */}
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    {product.category}
                  </p>

                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 min-h-[40px]">
                    {product.description}
                  </p>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-yellow-500">★</span>

                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {product.rating}
                    </span>
                  </div>

                  {/* 💰 Price */}
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{product.price}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Wishlist;
