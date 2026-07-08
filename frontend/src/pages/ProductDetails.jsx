import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const { addToCart } = useContext(CartContext);

  const [selectedImage, setSelectedImage] = useState("");

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [zoomStyle, setZoomStyle] = useState({});

  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };
  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
    setIsZoomed(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addReview = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        {
          product_id: Number(id),
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Review added");

      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.error || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}/related`)
      .then((res) => setRelatedProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!product) return;

    let recentProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    recentProducts = recentProducts.filter((item) => item.id !== product.id);

    recentProducts.unshift(product);

    recentProducts = recentProducts.slice(0, 6);

    localStorage.setItem("recentProducts", JSON.stringify(recentProducts));
  }, [product]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedImage(res.data.images[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return (
      <div
        className="
    bg-gray-100 dark:bg-gray-900

    rounded-xl

    flex items-center justify-center

    p-4 sm:p-6 lg:p-8

    min-h-[500px]
  "
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <Skeleton height={500} baseColor="#1f2937" highlightColor="#374151" />

          {/* Content */}
          <div>
            <Skeleton
              height={30}
              width={120}
              baseColor="#1f2937"
              highlightColor="#374151"
            />

            <div className="mt-4">
              <Skeleton
                height={50}
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            </div>

            <div className="mt-4">
              <Skeleton
                height={20}
                count={4}
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            </div>

            <div className="mt-6">
              <Skeleton
                height={40}
                width={150}
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            </div>

            <div className="mt-6">
              <Skeleton
                height={50}
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="
  bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10
"
      >
        {/* 🖼️ IMAGE */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[500px]">
          <div className="flex flex-col justify-center lg:sticky lg:top-10 h-fit">
            {/* 🖼️ Thumbnails */}
            <div className="flex lg:flex-col gap-3 shrink-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`border rounded-lg overflow-hidden w-20 h-20 bg-white ${
                    selectedImage === image
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 🔥 Main Image */}
            <div
              className="
    relative

    overflow-hidden

    rounded-3xl

    bg-white dark:bg-gray-800

    shadow-xl

    group
  "
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                style={zoomStyle}
                className="
      w-full

      lg:w-[400px]

      h-auto

      max-h-[450px]

      object-contain

      mx-auto my-2

      shrink

      transition-transform duration-200
    "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* SUBTLE OVERLAY */}

              <div
                className="
      absolute inset-0

      pointer-events-none

      bg-black/0

      group-hover:bg-black/5

      transition
    "
              />

              {/* ZOOM INDICATOR */}

              {isZoomed && (
                <div
                  className="
          absolute top-4 right-4

          px-3 py-1.5

          rounded-full

          bg-black/70

          text-white

          text-xs font-medium

          backdrop-blur-md
        "
                >
                  Zoomed View
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📦 INFO */}
        <div className="flex flex-col justify-center lg:sticky lg:top-10 h-fit">
          {/* Category */}
          <p className="text-blue-600 font-medium mb-2">{product.category}</p>

          {/* Name */}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-xl">★</span>

            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {Number(product.rating).toFixed(1)}
            </span>

            <span className="text-gray-500 dark:text-gray-400 text-sm">
              ({product.review_count} reviews)
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-7 mb-6 dark:text-gray-300">
            {product.description}
          </p>

          {/* Price */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 dark:text-white">
            ₹{product.price}
          </h2>

          {/* CTA */}
          <motion.button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="
          text-3xl font-bold
          text-gray-900 dark:text-white
        "
            >
              You may also like
            </h2>

            <p
              className="
          mt-2
          text-gray-500 dark:text-gray-400
        "
            >
              Similar products picked for you
            </p>
          </div>
        </div>

        <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-6
    "
        >
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="
          group

          bg-white dark:bg-gray-800

          border border-gray-200
          dark:border-gray-700

          rounded-3xl

          overflow-hidden

          hover:shadow-2xl
          hover:-translate-y-1

          transition-all duration-300
        "
            >
              {/* IMAGE */}
              <div
                className="
            aspect-square
            overflow-hidden
            bg-gray-100 dark:bg-gray-900
          "
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="
              w-full h-full
              object-cover

              group-hover:scale-105

              transition-transform duration-500
            "
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <p
                  className="
              text-xs uppercase tracking-wider

              text-blue-600 dark:text-blue-400

              font-semibold
            "
                >
                  {product.category}
                </p>

                <h3
                  className="
              mt-2

              text-lg font-semibold

              text-gray-800 dark:text-white

              line-clamp-2
            "
                >
                  {product.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <p
                    className="
                text-2xl font-bold

                text-gray-900 dark:text-white
              "
                  >
                    ₹{product.price}
                  </p>

                  <div
                    className="
                px-3 py-1.5

                rounded-full

                bg-blue-100 dark:bg-blue-500/10

                text-blue-700 dark:text-blue-300

                text-xs font-semibold
              "
                  >
                    View
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        className="
    mt-12

    bg-white dark:bg-gray-800

    rounded-3xl

    shadow-md dark:shadow-black/30

    p-6
  "
      >
        <h2
          className="
      text-2xl font-bold

      text-gray-800 dark:text-white

      mb-6
    "
        >
          Ratings & Reviews
        </h2>

        {/* REVIEW FORM */}

        <div className="space-y-4 mb-10">
          {/* RATING */}
          <div>
            <label
              className="
          block mb-2

          text-gray-700 dark:text-gray-300
        "
            >
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="
          w-full

          bg-gray-100 dark:bg-gray-700

          border border-gray-200
          dark:border-gray-600

          rounded-xl

          px-4 py-3

          text-gray-800 dark:text-white
        "
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>

              <option value={4}>⭐⭐⭐⭐</option>

              <option value={3}>⭐⭐⭐</option>

              <option value={2}>⭐⭐</option>

              <option value={1}>⭐</option>
            </select>
          </div>

          {/* COMMENT */}

          <div>
            <label
              className="
          block mb-2

          text-gray-700 dark:text-gray-300
        "
            >
              Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="
          w-full

          bg-gray-100 dark:bg-gray-700

          border border-gray-200
          dark:border-gray-600

          rounded-xl

          px-4 py-3

          text-gray-800 dark:text-white

          resize-none
        "
            />
          </div>

          {/* BUTTON */}

          <button
            onClick={addReview}
            disabled={loading}
            className="
        bg-blue-600 hover:bg-blue-700

        text-white

        px-6 py-3

        rounded-xl

        font-semibold

        transition
      "
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* REVIEWS */}
        <div
          className="
    flex items-center justify-between
    mb-6
  "
        >
          <div>
            <h3
              className="
        text-2xl font-bold
        text-gray-800 dark:text-white
      "
            >
              Customer Reviews
            </h3>

            <p
              className="
        text-sm
        text-gray-500 dark:text-gray-400
        mt-1
      "
            >
              See what buyers are saying about this product
            </p>
          </div>

          {reviews.length > 0 && (
            <div
              className="
        bg-blue-100 dark:bg-blue-900/30
        text-blue-700 dark:text-blue-300

        px-4 py-2
        rounded-xl

        text-sm font-semibold
      "
            >
              {reviews.length} Reviews
            </div>
          )}
        </div>
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <div
              className="
      text-center

      text-gray-500 dark:text-gray-400

      py-10
    "
            >
              No reviews yet
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="
            bg-gray-50 dark:bg-gray-700/40

            rounded-2xl

            p-5
          "
              >
                <div
                  className="
    flex items-start justify-between
    gap-4
    mb-3
  "
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className="
        font-semibold
        text-gray-800 dark:text-white
      "
                    >
                      {review.user_name}
                    </h3>

                    {review.verified_purchase && (
                      <span
                        className="
          text-xs
          bg-green-100 dark:bg-green-900/40
          text-green-700 dark:text-green-300

          px-2.5 py-1
          rounded-full

          font-medium
          whitespace-nowrap
        "
                      >
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div
                    className="
      flex items-center
      text-yellow-500
      text-sm
      shrink-0
    "
                  >
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>

                <p
                  className="
              text-gray-600 dark:text-gray-300
            "
                >
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;
