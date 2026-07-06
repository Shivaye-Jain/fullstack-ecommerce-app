import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css"
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <ThemeProvider>
          <App />
          <ToastContainer
          position="top-right"
          autoClose={1000}
          theme="colored"
          />
        </ThemeProvider>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>,
);
