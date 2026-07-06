import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.error || "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // =========================
  // Loading State
  // =========================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex items-center justify-center

          bg-gray-100 dark:bg-gray-900
          px-4
        "
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            bg-white dark:bg-gray-800

            px-10 py-8
            rounded-3xl

            shadow-xl dark:shadow-black/30

            border border-gray-200 dark:border-gray-700

            flex flex-col items-center
            gap-5
          "
        >
          {/* Spinner */}
          <div
            className="
              w-14 h-14
              rounded-full

              border-4
              border-gray-300
              border-t-black

              dark:border-gray-600
              dark:border-t-white

              animate-spin
            "
          />

          <div className="text-center">
            <h2
              className="
                text-2xl font-bold
                text-gray-900 dark:text-white
              "
            >
              Loading Order
            </h2>

            <p
              className="
                text-gray-500 dark:text-gray-400
                mt-1
              "
            >
              Fetching your order details...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // =========================
  // Order Not Found
  // =========================

  if (!order) {
    return (
      <div
        className="
          min-h-screen
          flex items-center justify-center

          bg-gray-100 dark:bg-gray-900
          px-4
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white dark:bg-gray-800

            max-w-md w-full

            rounded-3xl
            shadow-xl dark:shadow-black/30

            border border-gray-200 dark:border-gray-700

            p-10
            text-center
          "
        >
          <div className="text-6xl mb-5">
            😕
          </div>

          <h2
            className="
              text-3xl font-bold
              text-gray-900 dark:text-white
            "
          >
            Order Not Found
          </h2>

          <p
            className="
              text-gray-500 dark:text-gray-400
              mt-3
            "
          >
            The order you are trying to access
            does not exist or may have been removed.
          </p>
        </motion.div>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================

  return (
    <div
      className="
        min-h-screen
        bg-gray-100 dark:bg-gray-900

        py-10 px-4
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Order Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white dark:bg-gray-800

            rounded-3xl

            shadow-xl dark:shadow-black/30

            border border-gray-200 dark:border-gray-700

            overflow-hidden
          "
        >
          {/* ========================= */}
          {/* Header */}
          {/* ========================= */}

          <div className="p-6 md:p-8">
            <div
              className="
                flex flex-col lg:flex-row
                lg:items-center
                lg:justify-between
                gap-5
              "
            >
              {/* Left */}
              <div>
                <h1
                  className="
                    text-3xl md:text-4xl
                    font-bold

                    text-gray-900 dark:text-white
                  "
                >
                  Order Details
                </h1>

                <p
                  className="
                    text-gray-500 dark:text-gray-400
                    mt-2
                  "
                >
                  Order ID: ORD-2026-
                  {String(order.id).padStart(6, "0")}
                </p>

                <p
                  className="
                    text-sm
                    text-gray-500 dark:text-gray-400
                    mt-1
                  "
                >
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div className="flex flex-wrap gap-3">
                {/* Order Status */}
                <div
                  className={`
                    px-5 py-3
                    rounded-2xl

                    text-sm font-semibold

                    ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : order.status === "confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : order.status === "delivered"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }
                  `}
                >
                  {order.status === "pending" && "📦 Pending"}

                  {order.status === "confirmed" && "✅ Confirmed"}

                  {order.status === "shipped" && "🚚 Shipped"}

                  {order.status === "delivered" && "🎉 Delivered"}

                  {order.status === "cancelled" && "❌ Cancelled"}
                </div>

                {/* Payment Status */}
                <div
                  className="
                    px-5 py-3
                    rounded-2xl

                    text-sm font-semibold

                    bg-purple-100 text-purple-700
                    dark:bg-purple-900/30
                    dark:text-purple-300
                  "
                >
                  💳 {order.payment_status}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="
              border-t
              border-gray-200 dark:border-gray-700
            "
          />

          {/* ========================= */}
          {/* Ordered Items */}
          {/* ========================= */}

          <div className="p-6 md:p-8">
            <h2
              className="
                text-2xl font-bold

                text-gray-900 dark:text-white

                mb-6
              "
            >
              🛍 Ordered Items
            </h2>

            <div className="space-y-5">
              {order.items.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="
                    flex flex-col sm:flex-row
                    gap-5

                    bg-gray-50 dark:bg-gray-700

                    rounded-2xl
                    p-5

                    transition
                  "
                >
                  {/* Image */}
                  <div
                    className="
                      w-28 h-28

                      bg-white dark:bg-gray-800

                      rounded-2xl
                      p-3

                      flex items-center justify-center

                      shadow-sm
                    "
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="
                        w-full h-full
                        object-contain
                      "
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3
                      className="
                        text-xl font-semibold

                        text-gray-900 dark:text-white
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        text-gray-500 dark:text-gray-300
                        mt-2
                      "
                    >
                      Quantity: {item.quantity}
                    </p>

                    <p
                      className="
                        text-gray-500 dark:text-gray-400
                      "
                    >
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Total */}
                  <div
                    className="
                      flex flex-col
                      justify-center

                      text-right
                    "
                  >
                    <p
                      className="
                        text-2xl font-bold

                        text-gray-900 dark:text-white
                      "
                    >
                      ₹{item.price * item.quantity}
                    </p>

                    <p
                      className="
                        text-sm

                        text-gray-500 dark:text-gray-400
                      "
                    >
                      Item Total
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="
              border-t
              border-gray-200 dark:border-gray-700
            "
          />

          {/* ========================= */}
          {/* Bottom Section */}
          {/* ========================= */}

          <div
            className="
              grid grid-cols-1 lg:grid-cols-2
              gap-8

              p-6 md:p-8
            "
          >
            {/* Address */}
            <div>
              <h2
                className="
                  text-2xl font-bold

                  text-gray-900 dark:text-white

                  mb-5
                "
              >
                📍 Delivery Address
              </h2>

              <div
                className="
                  bg-gray-50 dark:bg-gray-700

                  rounded-2xl
                  p-5

                  space-y-2
                "
              >
                <p
                  className="
                    font-semibold

                    text-gray-900 dark:text-white
                  "
                >
                  {order.address.full_name}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  {order.address.phone}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  {order.address.address_line}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  {order.address.city}, {order.address.state}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  {order.address.pincode}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h2
                className="
                  text-2xl font-bold

                  text-gray-900 dark:text-white

                  mb-5
                "
              >
                💰 Payment Summary
              </h2>

              <div
                className="
                  bg-gray-50 dark:bg-gray-700

                  rounded-2xl
                  p-5
                "
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subtotal
                    </span>

                    <span className="font-medium dark:text-white">
                      ₹{order.total}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Discount
                    </span>

                    <span className="text-green-600 font-medium">
                      - ₹{order.discount}
                    </span>
                  </div>

                  <div
                    className="
                      border-t
                      border-gray-200 dark:border-gray-600

                      pt-4

                      flex justify-between
                    "
                  >
                    <span
                      className="
                        text-lg font-bold

                        text-gray-900 dark:text-white
                      "
                    >
                      Final Total
                    </span>

                    <span
                      className="
                        text-2xl font-bold

                        text-gray-900 dark:text-white
                      "
                    >
                      ₹{order.final_total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;