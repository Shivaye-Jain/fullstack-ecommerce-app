import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Payment() {
  const navigate = useNavigate();

  const location = useLocation();

  const { clearCart } = useContext(CartContext);

  const { cart = [], total = 0, selectedAddress = null } = location.state || {};

  // const total = cart.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

  const [couponCode, setCouponCode] = useState("");

  const [discount, setDiscount] = useState(0);

  const [finalTotal, setFinalTotal] = useState(total);

  const [couponLoading, setCouponLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-order`,
        {
          amount: finalTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "My Ecommerce Store",
        description: "Order Payment",
        order_id: order.id,
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          try {
            // ✅ VERIFY PAYMENT

            await axios.post(
              `${import.meta.env.VITE_API_URL}/verify-payment`,

              response,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            // ✅ CREATE ORDER AFTER PAYMENT SUCCESS

            await axios.post(
              `${import.meta.env.VITE_API_URL}/orders`,
              {
                items: cart,
                total,
                final_total: finalTotal,
                discount,
                coupon_code: couponCode,
                address_id: selectedAddress.id,
                payment_id: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            // ✅ CLEAR CART

            await clearCart();

            toast.success("Order placed successfully");

            navigate("/success", {
              state: {
                cart,
                total,
                selectedAddress,
                paymentId: response.razorpay_payment_id,
              },
            });
          } catch (err) {
            console.log(err);

            toast.error("Failed to save order");
          }
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function () {
        toast.error("Payment Failed");
        setLoading(false);
      });

      razor.open();
    } catch (err) {
      console.log(err);
      toast.error("Payment Failed");

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    try {
      setCouponLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/apply-coupon`,
        {
          code: couponCode,
          total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDiscount(response.data.discount);

      setFinalTotal(response.data.finalTotal);

      toast.success("Coupon Applied");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

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
      bg-white dark:bg-gray-800
      rounded-3xl
      shadow-2xl dark:shadow-black/40
      w-full max-w-5xl
      grid grid-cols-1 lg:grid-cols-2
      overflow-hidden
    "
      >
        {/* LEFT SIDE */}
        <div
          className="
        p-10
        flex flex-col justify-center
      "
        >
          <div
            className="
          w-20 h-20
          rounded-2xl
          bg-blue-100 dark:bg-blue-500/20
          flex items-center justify-center
          text-4xl
          mb-6
        "
          >
            🔒
          </div>

          <h1
            className="
          text-4xl font-bold
          text-gray-800 dark:text-white
          mb-4
        "
          >
            Secure Checkout
          </h1>

          <p
            className="
          text-gray-500 dark:text-gray-300
          text-lg
          leading-relaxed
          mb-8
        "
          >
            Your payment is securely processed through Razorpay. We do not store
            your card or banking details.
          </p>

          {/* FEATURES */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✔</span>

              <p className="text-gray-700 dark:text-gray-200">
                256-bit encrypted transactions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✔</span>

              <p className="text-gray-700 dark:text-gray-200">
                Supports UPI, Cards, Wallets & Net Banking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✔</span>

              <p className="text-gray-700 dark:text-gray-200">
                Fast and secure payment experience
              </p>
            </div>
          </div>

          {/* PAYMENT BUTTON */}
          <motion.button
            onClick={handlePayment}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="
          w-full
          bg-blue-600 hover:bg-blue-700
          text-white
          py-4
          rounded-2xl
          font-semibold
          text-lg
          transition
          shadow-lg hover:shadow-xl
        "
          >
            {loading ? "Processing Payment..." : `Pay ₹${finalTotal}`}
          </motion.button>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
        bg-gradient-to-br
        from-blue-600
        to-indigo-700
        text-white
        p-10
        flex flex-col justify-center
      "
        >
          <p className="uppercase tracking-widest text-sm opacity-80 mb-3">
            Order Summary
          </p>

          <h2 className="text-5xl font-bold mb-8">₹{finalTotal}</h2>

          {/* SUMMARY */}
          <div className="space-y-5 text-white/90">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>

              <span>₹{(total * 0.9).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg">
              <span>Shipping</span>

              <span>₹{(total * 0.1).toFixed(2)}</span>
            </div>

            {/* COUPON */}
            <div className="pt-4">
              <p className="mb-3 font-medium">Apply Coupon</p>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="
                flex-1
                px-4 py-3
                rounded-xl
                bg-white/10
                border border-white/20
                outline-none
                placeholder:text-white/60
              "
                />

                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="
                bg-white
                text-blue-700
                px-5
                rounded-xl
                font-semibold
              "
                >
                  {couponLoading ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>

            {/* DISCOUNT */}
            {discount > 0 && (
              <div
                className="
                flex justify-between
                text-green-300
                text-lg
              "
              >
                <span>Discount</span>

                <span>- ₹{discount}</span>
              </div>
            )}

            {/* FINAL TOTAL */}
            <div
              className="
            border-t border-white/20
            pt-5
            flex justify-between
            font-bold text-2xl
          "
            >
              <span>Total</span>

              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div
            className="
          mt-12
          bg-white/10
          backdrop-blur-lg
          rounded-2xl
          p-6
          border border-white/20
        "
          >
            <p className="text-sm uppercase tracking-widest opacity-70 mb-5">
              Supported Payments
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="
              bg-white/10
              rounded-xl
              p-4
              flex items-center justify-center
              font-semibold
            "
              >
                💳 Cards
              </div>

              <div
                className="
              bg-white/10
              rounded-xl
              p-4
              flex items-center justify-center
              font-semibold
            "
              >
                📱 UPI
              </div>

              <div
                className="
              bg-white/10
              rounded-xl
              p-4
              flex items-center justify-center
              font-semibold
            "
              >
                🏦 Net Banking
              </div>

              <div
                className="
              bg-white/10
              rounded-xl
              p-4
              flex items-center justify-center
              font-semibold
            "
              >
                👛 Wallets
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Payment;
