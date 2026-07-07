import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addressToDelete, setAddressToDelete] = useState(null);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [addressLoading, setAddressLoading] = useState(false);

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/addresses/${id}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateAddress = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8080/addresses/${editingAddress.id}`,
        editingAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchAddresses();

      setShowEditModal(false);

      setEditingAddress(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAddress = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:8080/addresses/${addressToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchAddresses();

      setShowDeleteModal(false);

      setAddressToDelete(null);

      if (selectedAddress?.id === addressToDelete.id) {
        setSelectedAddress(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addAddress = async () => {
    try {
      setAddressLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/addresses`,
        addressForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Address added");

      await fetchAddresses();

      setAddressForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddressModal(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to add address");
    } finally {
      setAddressLoading(false);
    }
  };

  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const proceedToPayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    navigate("/payment", {
      state: {
        cart,
        total,
        selectedAddress,
      },
    });
  };

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        setSelectedAddress(addresses[0]);
      }
    }
  }, [addresses]);

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
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🧍 LEFT — SHIPPING + ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🚚 Shipping Details */}
          <div
            className="
              bg-white dark:bg-gray-800
              p-6 rounded-2xl
              shadow-sm dark:shadow-black/30
            "
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Selected Delivery Address
            </h2>

            {selectedAddress ? (
              <div
                className="
      space-y-3

      bg-gray-50 dark:bg-gray-700/50

      border border-gray-200 dark:border-gray-600

      rounded-2xl

      p-5
    "
              >
                <p
                  className="
        font-semibold
        text-lg

        text-gray-800 dark:text-white
      "
                >
                  {selectedAddress.full_name}
                </p>

                <p
                  className="
        text-gray-600 dark:text-gray-300
      "
                >
                  {selectedAddress.address_line}
                </p>

                <p
                  className="
        text-gray-600 dark:text-gray-300
      "
                >
                  {selectedAddress.city}, {selectedAddress.state}
                </p>

                <p
                  className="
        text-gray-600 dark:text-gray-300
      "
                >
                  {selectedAddress.pincode}
                </p>

                <p
                  className="
        text-gray-600 dark:text-gray-300
      "
                >
                  {selectedAddress.phone}
                </p>
              </div>
            ) : (
              <div
                className="
      bg-red-100 dark:bg-red-500/10

      border border-red-300 dark:border-red-500/30

      text-red-600 dark:text-red-400

      rounded-2xl

      p-4
    "
              >
                No address selected
              </div>
            )}
          </div>

          {/* 📦 Order Items */}
          <div
            className="
              bg-white dark:bg-gray-800
              p-6 rounded-2xl
              shadow-sm dark:shadow-black/30
            "
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Order Items
            </h2>

            <div className="space-y-4">
              {/* EMPTY CART / ORDER ITEMS */}
              {cart.length === 0 ? (
                <div
                  className="
      flex flex-col items-center justify-center

      text-center

      py-14 px-6

      rounded-3xl

      bg-white dark:bg-gray-800

      border border-gray-200 dark:border-gray-700
    "
                >
                  {/* ICON */}
                  <div
                    className="
        w-16 h-16

        rounded-full

        bg-blue-100 dark:bg-blue-500/10

        flex items-center justify-center

        text-3xl
      "
                  >
                    🛒
                  </div>

                  {/* HEADING */}
                  <h2
                    className="
        mt-5

        text-xl font-semibold

        text-gray-800 dark:text-white
      "
                  >
                    Your cart feels lonely
                  </h2>

                  {/* SUBTEXT */}
                  <p
                    className="
        mt-2

        text-sm

        text-gray-500 dark:text-gray-400

        max-w-sm

        leading-6
      "
                  >
                    Looks like you haven’t added anything yet. Explore products
                    and discover something amazing.
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() => navigate("/")}
                    className="
        mt-6

        bg-blue-600 hover:bg-blue-700

        text-white

        px-5 py-2.5

        rounded-xl

        text-sm font-medium

        transition-all duration-200
      "
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="
                    flex flex-col sm:flex-row
                    sm:items-center
                    justify-between
                    gap-4
                    border-b border-gray-200 dark:border-gray-700
                    pb-4
                  "
                    >
                      {/* 🖼️ Product */}
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="
                        w-20 h-20
                        object-contain
                        bg-gray-100 dark:bg-gray-700
                        rounded-xl
                        p-2
                      "
                        />

                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* 💰 Price */}
                      <p className="font-semibold text-gray-800 dark:text-white">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 💳 RIGHT — PAYMENT SUMMARY */}
        <div
          className="
            bg-white dark:bg-gray-800
            p-6 rounded-2xl
            shadow-md dark:shadow-black/30
            h-fit sticky top-6
          "
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Payment Summary
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>

              <span className="text-green-600 dark:text-green-400">Free</span>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div
            className="
    mt-10
    pt-8

    border-t border-gray-200
    dark:border-gray-700

    mb-8
  "
          >
            {/* HEADER */}
            <div className="mb-6">
              <h2
                className="
      text-2xl font-bold
      text-gray-800 dark:text-white
    "
              >
                Delivery Address
              </h2>

              <p
                className="
      text-sm
      text-gray-500 dark:text-gray-400

      mt-1
    "
              >
                Select where you want your order delivered
              </p>

              <button
                onClick={() => setShowAddressModal(true)}
                className="
      mt-4

      bg-blue-600 hover:bg-blue-700

      text-white

      px-5 py-2.5

      rounded-xl

      text-sm font-medium

      transition
    "
              >
                + Add Address
              </button>
            </div>

            {/* ADDRESS LIST */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div
                  className="
      flex flex-col items-center justify-center

      text-center

      py-16 px-6

      rounded-3xl

      bg-white dark:bg-gray-800

      border border-gray-200 dark:border-gray-700

      shadow-sm
    "
                >
                  {/* ICON */}
                  <div
                    className="
        w-24 h-24

        rounded-full

        bg-blue-100 dark:bg-blue-500/10

        flex items-center justify-center

        text-5xl
      "
                  >
                    📍
                  </div>

                  {/* HEADING */}
                  <h2
                    className="
    mt-5

    text-xl font-semibold

    text-gray-800 dark:text-white
  "
                  >
                    No delivery addresses found
                  </h2>

                  {/* SUBTEXT */}
                  <p
                    className="
    mt-2

    text-sm

    text-gray-500 dark:text-gray-400

    max-w-sm

    leading-6
  "
                  >
                    Add a delivery address to continue with your checkout and
                    receive your orders smoothly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">{/* YOUR ADDRESS CARDS */}</div>
              )}
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddress(address)}
                  className={`
        border-2 rounded-2xl
        p-5
        cursor-pointer
        transition-all duration-200
        hover:shadow-md

        ${
          selectedAddress?.id === address.id
            ? `
              border-blue-600
              bg-blue-50 dark:bg-blue-500/10
            `
            : `
              border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
            `
        }
      `}
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* LEFT CONTENT */}
                    <div className="flex-1">
                      {/* NAME + DEFAULT BADGE */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className="
                font-semibold text-lg
                text-gray-800 dark:text-white
              "
                        >
                          {address.full_name}
                        </h3>

                        {address.is_default && (
                          <span
                            className="
                  bg-green-100
                  text-green-700
                  dark:bg-green-900/40
                  dark:text-green-300

                  px-3 py-1

                  rounded-full

                  text-xs font-semibold
                "
                          >
                            Default
                          </span>
                        )}
                      </div>

                      {/* ADDRESS */}
                      <p
                        className="
              text-gray-600 dark:text-gray-300
              mt-3
              leading-6
            "
                      >
                        {address.address_line}
                      </p>

                      <p className="text-gray-600 dark:text-gray-300">
                        {address.city}, {address.state}
                      </p>

                      <p className="text-gray-600 dark:text-gray-300">
                        {address.pincode}
                      </p>

                      <p
                        className="
              text-gray-600 dark:text-gray-300
              mt-3
            "
                      >
                        📞 {address.phone}
                      </p>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-4 mt-5">
                        {/* SET DEFAULT */}
                        {!address.is_default && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.id);
                            }}
                            className="
                  text-sm font-medium

                  text-blue-600
                  hover:text-blue-700

                  transition
                "
                          >
                            Set as Default
                          </button>
                        )}

                        {/* EDIT */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setShowEditModal(true);

                            setEditingAddress(address);
                          }}
                          className="
                text-sm font-medium

                text-gray-600 dark:text-gray-300
                hover:text-black dark:hover:text-white

                transition
              "
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setAddressToDelete(address);

                            setShowDeleteModal(true);
                          }}
                          className="
                text-sm font-medium

                text-red-500
                hover:text-red-600

                transition
              "
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* SELECTED BADGE */}
                    {selectedAddress?.id === address.id && (
                      <div
                        className="
              bg-blue-600
              text-white

              px-3 py-1.5

              rounded-full

              text-xs font-semibold

              whitespace-nowrap
            "
                      >
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* EDIT ADDRESS MODAL */}
              {showEditModal && editingAddress && (
                <div
                  className="
      fixed inset-0

      bg-black/50

      flex items-center justify-center

      z-50

      px-4
    "
                >
                  <div
                    className="
        bg-white dark:bg-gray-900

        w-full max-w-lg

        rounded-2xl

        p-6

        shadow-2xl
      "
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                      <h2
                        className="
            text-2xl font-bold
            text-gray-800 dark:text-white
          "
                      >
                        Edit Address
                      </h2>

                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingAddress(null);
                        }}
                        className="
            text-gray-500
            hover:text-black dark:hover:text-white
          "
                      >
                        ✕
                      </button>
                    </div>

                    {/* FORM */}
                    <div className="space-y-4">
                      {/* FULL NAME */}
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={editingAddress.full_name}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            full_name: e.target.value,
                          })
                        }
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />

                      {/* PHONE */}
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={editingAddress.phone}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            phone: e.target.value,
                          })
                        }
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />

                      {/* ADDRESS */}
                      <textarea
                        placeholder="Address"
                        value={editingAddress.address_line}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            address_line: e.target.value,
                          })
                        }
                        rows={3}
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />

                      {/* CITY */}
                      <input
                        type="text"
                        placeholder="City"
                        value={editingAddress.city}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            city: e.target.value,
                          })
                        }
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />

                      {/* STATE */}
                      <input
                        type="text"
                        placeholder="State"
                        value={editingAddress.state}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            state: e.target.value,
                          })
                        }
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />

                      {/* PINCODE */}
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={editingAddress.pincode}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            pincode: e.target.value,
                          })
                        }
                        className="
            w-full

            border border-gray-300 dark:border-gray-700

            bg-white dark:bg-gray-800

            text-gray-800 dark:text-white

            rounded-xl

            px-4 py-3

            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingAddress(null);
                        }}
                        className="
            px-5 py-2.5

            rounded-xl

            border border-gray-300 dark:border-gray-700

            text-gray-700 dark:text-gray-300
          "
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleUpdateAddress}
                        className="
            bg-blue-600 hover:bg-blue-700

            text-white

            px-5 py-2.5

            rounded-xl

            font-medium

            transition
          "
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* DELETE ADDRESS MODAL */}
              {showDeleteModal && addressToDelete && (
                <div
                  className="
      fixed inset-0

      bg-black/50

      flex items-center justify-center

      z-50

      px-4
    "
                >
                  <div
                    className="
        bg-white dark:bg-gray-900

        w-full max-w-md

        rounded-2xl

        p-6

        shadow-2xl
      "
                  >
                    {/* HEADER */}
                    <h2
                      className="
          text-2xl font-bold
          text-gray-800 dark:text-white
        "
                    >
                      Delete Address
                    </h2>

                    {/* MESSAGE */}
                    <p
                      className="
          text-gray-600 dark:text-gray-300

          mt-4

          leading-7
        "
                    >
                      Are you sure you want to delete this address?
                    </p>

                    {/* ADDRESS PREVIEW */}
                    <div
                      className="
          mt-5

          bg-gray-100 dark:bg-gray-800

          rounded-xl

          p-4
        "
                    >
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {addressToDelete.full_name}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {addressToDelete.address_line}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {addressToDelete.city}, {addressToDelete.state}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 mt-6">
                      {/* CANCEL */}
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);

                          setAddressToDelete(null);
                        }}
                        className="
            px-5 py-2.5

            rounded-xl

            border border-gray-300 dark:border-gray-700

            text-gray-700 dark:text-gray-300
          "
                      >
                        Cancel
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={handleDeleteAddress}
                        className="
            bg-red-500 hover:bg-red-600

            text-white

            px-5 py-2.5

            rounded-xl

            font-medium

            transition
          "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🚀 Proceed to Payment Button */}
          <motion.button
            onClick={proceedToPayment}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              mt-6 w-full
              bg-green-600 hover:bg-green-700
              text-white
              py-3 rounded-xl
              font-medium
              transit ion
              shadow-lg hover:shadow-xl
            "
          >
            Continue to Payment
          </motion.button>
        </div>
      </div>
      {showAddressModal && (
        <div
          className="
        fixed inset-0

        bg-black/50

        flex items-center justify-center

        z-50

        p-4
      "
        >
          <div
            className="
          bg-white dark:bg-gray-800

          rounded-3xl

          p-6

          w-full max-w-xl

          shadow-2xl
        "
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="
              text-2xl font-bold

              text-gray-800 dark:text-white
            "
              >
                Add New Address
              </h2>

              <button
                onClick={() => setShowAddressModal(false)}
                className="
              text-gray-500 hover:text-red-500
            "
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={addressForm.full_name}
                onChange={handleAddressChange}
                className="
              w-full

              px-4 py-3

              rounded-xl

              bg-gray-100 dark:bg-gray-700

              text-gray-800 dark:text-white
            "
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={addressForm.phone}
                onChange={handleAddressChange}
                className="
              w-full

              px-4 py-3

              rounded-xl

              bg-gray-100 dark:bg-gray-700

              text-gray-800 dark:text-white
            "
              />

              <textarea
                name="address_line"
                placeholder="Address Line"
                value={addressForm.address_line}
                onChange={handleAddressChange}
                rows={3}
                className="
              w-full

              px-4 py-3

              rounded-xl

              bg-gray-100 dark:bg-gray-700

              text-gray-800 dark:text-white

              resize-none
            "
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="
                w-full

                px-4 py-3

                rounded-xl

                bg-gray-100 dark:bg-gray-700

                text-gray-800 dark:text-white
              "
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  className="
                w-full

                px-4 py-3

                rounded-xl

                bg-gray-100 dark:bg-gray-700

                text-gray-800 dark:text-white
              "
                />
              </div>

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                className="
              w-full

              px-4 py-3

              rounded-xl

              bg-gray-100 dark:bg-gray-700

              text-gray-800 dark:text-white
            "
              />

              <button
                onClick={addAddress}
                disabled={addressLoading}
                className="
              w-full

              bg-blue-600 hover:bg-blue-700

              text-white

              py-3

              rounded-xl

              font-semibold

              transition
            "
              >
                {addressLoading ? "Adding Address..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Checkout;
