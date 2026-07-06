import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    cart = [],
    total = 0,
    selectedAddress = null,
    paymentId = "",
  } = location.state || {};

  return (
    <motion.div
      className="
        min-h-screen
        bg-gray-100 dark:bg-[#0f172a]

        flex items-center justify-center

        p-4
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <div
        className="
          w-full max-w-4xl

          bg-white dark:bg-gray-800

          rounded-3xl

          shadow-2xl dark:shadow-black/40

          overflow-hidden
        "
      >

        {/* TOP SUCCESS SECTION */}
        <div
          className="
            bg-gradient-to-r
            from-green-500
            to-emerald-600

            text-white

            p-10

            text-center
          "
        >

          <div
            className="
              w-24 h-24

              rounded-full

              bg-white/20

              flex items-center justify-center

              text-5xl

              mx-auto mb-6
            "
          >
            ✔
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Payment Successful
          </h1>

          <p className="text-lg text-white/90">
            Your order has been placed successfully.
          </p>

        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-10">

          {/* PAYMENT INFO */}
          <div
            className="
              bg-gray-50 dark:bg-gray-700/40

              rounded-2xl

              p-6
            "
          >

            <h2
              className="
                text-2xl font-bold

                text-gray-800 dark:text-white

                mb-5
              "
            >
              Payment Details
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">
                  Payment ID
                </span>

                <span className="font-medium text-gray-800 dark:text-white">
                  {paymentId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">
                  Amount Paid
                </span>

                <span className="font-bold text-xl text-green-600">
                  ₹{total}
                </span>
              </div>

            </div>

          </div>

          {/* DELIVERY ADDRESS */}
          {
            selectedAddress && (
              <div
                className="
                  bg-gray-50 dark:bg-gray-700/40

                  rounded-2xl

                  p-6
                "
              >

                <h2
                  className="
                    text-2xl font-bold

                    text-gray-800 dark:text-white

                    mb-5
                  "
                >
                  Delivery Address
                </h2>

                <div className="space-y-2">

                  <p className="font-semibold text-gray-800 dark:text-white">
                    {selectedAddress.full_name}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedAddress.address_line}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedAddress.pincode}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedAddress.phone}
                  </p>

                </div>

              </div>
            )
          }

          {/* ORDER ITEMS */}
          <div>

            <h2
              className="
                text-2xl font-bold

                text-gray-800 dark:text-white

                mb-5
              "
            >
              Order Items
            </h2>

            <div className="space-y-4">

              {
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex items-center justify-between

                      bg-gray-50 dark:bg-gray-700/40

                      rounded-2xl

                      p-4
                    "
                  >

                    <div className="flex items-center gap-4">

                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="
                          w-20 h-20

                          object-contain

                          bg-white dark:bg-gray-800

                          rounded-xl

                          p-2
                        "
                      />

                      <div>

                        <h3
                          className="
                            font-semibold

                            text-gray-800 dark:text-white
                          "
                        >
                          {item.name}
                        </h3>

                        <p
                          className="
                            text-sm

                            text-gray-500 dark:text-gray-300
                          "
                        >
                          Quantity: {item.quantity}
                        </p>

                      </div>

                    </div>

                    <p
                      className="
                        font-bold

                        text-gray-800 dark:text-white
                      "
                    >
                      ₹{item.price * item.quantity}
                    </p>

                  </div>
                ))
              }

            </div>

          </div>

          {/* BUTTONS */}
          <div
            className="
              flex flex-col sm:flex-row

              gap-4
            "
          >

            <button
              onClick={() => navigate("/orders")}
              className="
                flex-1

                bg-blue-600 hover:bg-blue-700

                text-white

                py-4

                rounded-2xl

                font-semibold

                transition
              "
            >
              View Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="
                flex-1

                border border-gray-300
                dark:border-gray-600

                text-gray-800 dark:text-white

                py-4

                rounded-2xl

                font-semibold

                hover:bg-gray-100
                dark:hover:bg-gray-700

                transition
              "
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default Success;