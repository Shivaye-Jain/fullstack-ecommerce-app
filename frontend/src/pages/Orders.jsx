import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
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
        My Orders
      </h1>

      {/* ❌ No Orders */}
      {orders.length === 0 ? (
        <div
          className="
            bg-white dark:bg-gray-800
            p-6 rounded-2xl
            shadow-sm dark:shadow-black/30
            text-gray-500 dark:text-gray-300
          "
        >
          No orders yet
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="
      bg-white dark:bg-gray-800
      rounded-2xl
      shadow-md dark:shadow-black/30
      p-6
      border border-gray-200 dark:border-gray-700
    "
              whileHover={{ scale: 1.01 }}
            >
              {/* 📦 Header */}
              <div
                className="
        flex flex-col lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-6
      "
              >
                {/* Left */}
                <div>
                  <h2
                    className="
            font-bold text-2xl
            text-gray-800 dark:text-white
          "
                  >
                    Order ID: ORD-2026-{String(order.id).padStart(6, "0")}
                  </h2>

                  <p
                    className="
            text-sm
            text-gray-500 dark:text-gray-300
            mt-1
          "
                  >
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Right */}
                <div
                  className="
          flex flex-col sm:flex-row
          sm:items-center
          gap-4
        "
                >
                  {/* Status */}
                  <div
                    className={`
    px-4 py-2
    rounded-full
    text-sm font-medium
    w-fit

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

                  {/* Total */}
                  <p
                    className="
            font-bold text-3xl
            text-gray-900 dark:text-white
          "
                  >
                    ₹{order.total}
                  </p>
                </div>
              </div>

              {/* 📍 Delivery Address */}
              <div
                className="
    bg-gray-50 dark:bg-gray-700
    rounded-2xl
    p-5
    mb-6
  "
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📍</span>

                  <h3
                    className="
        font-semibold text-lg
        text-gray-800 dark:text-white
      "
                  >
                    Delivery Address
                  </h3>
                </div>

                <div className="space-y-1">
                  <p
                    className="
        text-gray-800 dark:text-white
        font-medium
      "
                  >
                    {order.full_name}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {order.address_line}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {order.city}, {order.state}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {order.pincode}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 pt-2">
                    📞 {order.phone}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="
        border-t
        border-gray-200 dark:border-gray-700
        mb-6
      "
              />

              {/* 🛍️ Items */}
              <div className="space-y-4">
                {order.items.slice(0, 2).map((item, index) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className="
            flex flex-col sm:flex-row
            sm:items-center
            justify-between
            gap-4

            bg-gray-50 dark:bg-gray-700
            rounded-2xl
            p-4

            transition
          "
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="
                w-24 h-24
                object-contain

                bg-white dark:bg-gray-800
                rounded-2xl
                p-3

                shadow-sm
              "
                      />

                      {/* Product Info */}
                      <div>
                        <h3
                          className="
                  font-semibold text-lg
                  text-gray-800 dark:text-white
                "
                        >
                          {item.name}
                        </h3>

                        <p
                          className="
                  text-sm
                  text-gray-500 dark:text-gray-300
                  mt-1
                "
                        >
                          Quantity: {item.quantity}
                        </p>

                        <p
                          className="
                  text-sm
                  text-gray-500 dark:text-gray-400
                "
                        >
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div
                      className="
              text-right
            "
                    >
                      <p
                        className="
                text-xl font-bold
                text-gray-800 dark:text-white
              "
                      >
                        ₹{item.price * item.quantity}
                      </p>

                      <p
                        className="
                text-sm
                text-gray-500 dark:text-gray-400
                mt-1
              "
                      >
                        Item Total
                      </p>
                    </div>
                  </motion.div>
                ))}
                {order.items.length > 2 && (
                  <div
                    className="
      mt-3
      inline-flex
      items-center
      px-4 py-2

      rounded-xl

      bg-gray-100 dark:bg-gray-700
      text-gray-700 dark:text-gray-300

      text-sm font-medium

      border border-gray-200 dark:border-gray-600

      hover:bg-gray-200
      dark:hover:bg-gray-600

      transition
      cursor-pointer
      w-fit
    "
                  >
                    +{order.items.length - 2} more item
                    {order.items.length - 2 > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              {/* 👇 View Details Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="
      px-5 py-3
      rounded-xl
      bg-black text-white
      dark:bg-white dark:text-black

      font-medium
      hover:opacity-90
      transition
    "
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Orders;
