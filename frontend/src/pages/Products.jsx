import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const [recentProducts, setRecentProducts] = useState([]);

  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All",
  );

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );

  const { addToCart } = useContext(CartContext);

  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/categories");

      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await axios.get(
        `http://localhost:8080/products?page=${page}&limit=8&search=${debouncedSearch}&category=${selectedCategory}&sort=${sort}`,
      );

      setProducts(res.data.products);

      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.error || "Failed to load products");
      toast.error(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams({
      page: page.toString(),
      search: debouncedSearch,
      category: selectedCategory,
      sort,
    });
  }, [page, debouncedSearch, selectedCategory, sort]);

  useEffect(() => {
    fetchProducts();

    fetchCategories();
  }, [page, debouncedSearch, selectedCategory, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const storedProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    setRecentProducts(storedProducts);
  }, []);

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
        Products
      </h1>

      {/* 🔍 Search + 🏷️ Categories */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-white
            px-4 py-3 rounded-xl
            shadow-sm dark:shadow-black/30
            w-full md:w-80
            outline-none
            border border-gray-200 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500
          "
        />

        {/* Filters */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="
    p-3 rounded-xl border
    dark:bg-gray-800
    dark:border-gray-700
    dark:text-white
    outline-none
  "
        >
          <option value="">Default</option>

          <option value="price_asc">Price: Low to High</option>

          <option value="price_desc">Price: High to Low</option>

          <option value="rating">Rating</option>

          <option value="newest">Newest</option>
        </select>

        {/* Categories */}
        <div className="flex gap-3 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl transition font-medium ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm dark:shadow-black/30"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="
          bg-white dark:bg-gray-800
          rounded-2xl
          p-4
          animate-pulse
        "
            >
              <div className="h-52 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>

              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>

              <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 📦 Product Count */}
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Showing {products.length} products
          </p>

          {error && (
            <div
              className="
      flex flex-col items-center justify-center
      py-24 text-center
    "
            >
              <div className="text-7xl mb-6">⚠️</div>

              <h2
                className="
        text-3xl font-bold
        text-gray-800 dark:text-white
        mb-3
      "
              >
                Something Went Wrong
              </h2>

              <p
                className="
        text-gray-500 dark:text-gray-400
        mb-6
      "
              >
                {error}
              </p>

              <button
                onClick={fetchProducts}
                className="
        bg-red-600 hover:bg-red-700
        text-white
        px-6 py-3
        rounded-xl
        transition
      "
              >
                Retry
              </button>
            </div>
          )}

          {/* 🛍️ Empty State */}
          {!error && products.length === 0 ? (
            <div
              className="
      flex flex-col items-center justify-center
      py-24 text-center
    "
            >
              <div className="text-7xl mb-6">📦</div>

              <h2
                className="
        text-3xl font-bold
        text-gray-800 dark:text-white
        mb-3
      "
              >
                No Products Found
              </h2>

              <p
                className="
        text-gray-500 dark:text-gray-400
        max-w-md mb-6
      "
              >
                Try changing your search, category, or sorting filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSort("");
                  setPage(1);
                }}
                className="
        bg-blue-600 hover:bg-blue-700
        text-white
        px-6 py-3
        rounded-xl
        transition
      "
              >
                Reset Filters
              </button>
            </div>
          ) : (
            !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id}>
                    <motion.div
                      className="
            relative group
            bg-white dark:bg-gray-800
            rounded-2xl overflow-hidden
            shadow-sm hover:shadow-2xl
            dark:shadow-black/30
            transition duration-300
            flex flex-col
            border border-transparent
            hover:border-blue-500/20
          "
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* ❤️ Wishlist */}
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
                        {wishlist.find((item) => item.id === product.id)
                          ? "❤️"
                          : "🤍"}
                      </button>

                      {/* 🖼️ Product Image */}
                      <div className="overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="
                h-52 w-full
                object-contain
                bg-white dark:bg-gray-800
                p-4
                transition duration-500
                group-hover:scale-110
              "
                        />
                      </div>

                      {/* 📦 Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Category */}
                        <p className="text-sm text-blue-600 font-medium mb-1">
                          {product.category}
                        </p>

                        {/* Product Name */}
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 min-h-10">
                          {product.description}
                        </p>

                        {/* ⭐ Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          {product.review_count > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>

                              <span className="text-gray-800 dark:text-gray-200">
                                {Number(product.rating).toFixed(1)}
                              </span>

                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                ({product.review_count})
                              </span>
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              No reviews
                            </p>
                          )}
                        </div>

                        {/* 📦 Stock */}
                        {product.stock > 0 ? (
                          <p className="text-sm text-green-600 font-medium mb-2">
                            In Stock ({product.stock} left)
                          </p>
                        ) : (
                          <p className="text-sm text-red-500 font-medium mb-2">
                            Out of Stock
                          </p>
                        )}

                        {/* 💰 Price */}
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                          ₹{product.price}
                        </p>

                        {/* 🛒 Add to Cart */}
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();

                            if (product.stock === 0) return;

                            addToCart(product);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className={`
                mt-auto py-3 rounded-xl
                font-medium transition
                ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
                        >
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </motion.button>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )
          )}
        </>
      )}
      {recentProducts.length > 0 && (
        <div className="mt-16">
          <h2
            className="
              text-2xl font-bold
              text-gray-800 dark:text-white
              mb-6
            "
          >
            Recently Viewed
          </h2>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-6
              gap-5
            "
          >
            {recentProducts.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="
                  bg-white dark:bg-gray-800
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  transition-all duration-300
                  border border-gray-100 dark:border-gray-700
                "
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="
                    h-40 w-full
                    object-cover
                  "
                />

                <div className="p-4">
                  <h3
                    className="
                      font-semibold
                      text-gray-800 dark:text-white
                      line-clamp-1
                    "
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                      text-blue-600
                      font-bold
                      mt-2
                    "
                  >
                    ₹{item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {!error && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="
      flex items-center justify-center
      px-5 h-11
      rounded-xl
      bg-white dark:bg-gray-800
      border dark:border-gray-700
      shadow-sm
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      dark:text-white
      font-medium  disabled:opacity-50
          disabled:cursor-not-allowed
    "
            disabled={page === 1}
          >
            Prev
          </button>

          <div
            className="
      flex items-center justify-center
      h-11 px-5
      rounded-xl
      bg-blue-600
      text-white
      font-semibold
      shadow-sm
    "
          >
            Page {page}
          </div>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="
      flex items-center justify-center
      px-5 h-11
      rounded-xl
      bg-white dark:bg-gray-800
      border dark:border-gray-700
      shadow-sm
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      dark:text-white
      font-medium  disabled:opacity-50
          disabled:cursor-not-allowed
    "
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default Products;
