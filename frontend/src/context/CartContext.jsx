import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    const existingItem = cart.find((item) => item.product_id === product.id);

    if (existingItem && existingItem.quantity >= product.stock) {
      toast.error("Stock Limit Reached");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Added to cart");

      fetchCart();
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.error || "Failed to add to cart");
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
      toast.success("Item Removed");
    } catch (err) {
      console.log(err);

      toast.error("Failed to remove item");
    }
  };

  const increaseQuantity = async (item) => {
    if (item.quantity >= item.stock) {
      toast.error("Stock Limit Reached");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${item.id}`,
        {
          quantity: item.quantity + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };
  const decreaseQuantity = async (item) => {

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${item.id}`,
        {
          quantity: item.quantity - 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      );

      setCart([]);
    } catch(err){
      console.log(err);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        fetchCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
