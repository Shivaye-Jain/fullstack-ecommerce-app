import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        {
          product_id: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Added to wishlist");

      fetchWishlist();
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.error || "Failed to add");
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Removed from wishlist");

      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists){
      await removeFromWishlist(product.id);
    }
    else{
      await addToWishlist(product);
    }
  }

  return (
    <WishlistContext.Provider value={{wishlist, fetchWishlist, addToWishlist, removeFromWishlist, toggleWishlist}}>
      {children}
    </WishlistContext.Provider>
  )
};