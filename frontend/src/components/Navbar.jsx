import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import {
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";

function Navbar() {

  const { darkMode, setDarkMode } =
    useContext(ThemeContext);

  const {
    isAuthenticated,
    user,
    logout,
  } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const dropdownRef = useRef();

  useEffect(() => {

    const handler = (e) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };

  }, []);

  const handleLogout = () => {

    logout();

    window.location.href = "/login";
  };

  return (
    <nav
      className="
        sticky top-0 z-50

        bg-white/80 dark:bg-gray-900/80

        backdrop-blur-xl

        border-b border-gray-200/70
        dark:border-gray-800/70

        px-6 lg:px-10

        py-4
      "
    >

      <div
        className="
          flex items-center justify-between
        "
      >

        {/* LEFT */}

        <div className="flex items-center gap-10">

          {/* LOGO */}

          <Link to="/">

            <h1
              className="
                text-2xl font-black

                text-transparent
                bg-clip-text

                bg-gradient-to-r
                from-blue-600
                to-indigo-600
              "
            >
              MyStore
            </h1>

          </Link>

          {/* MAIN LINKS */}

          <div
            className="
              hidden md:flex

              items-center gap-8
            "
          >

            <Link
              to="/"
              className="
                text-gray-700 dark:text-gray-200

                hover:text-blue-600

                font-medium

                transition
              "
            >
              Products
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className="
                    text-gray-700 dark:text-gray-200

                    hover:text-blue-600

                    font-medium

                    transition
                  "
                >
                  Wishlist
                </Link>

                <Link
                  to="/cart"
                  className="
                    text-gray-700 dark:text-gray-200

                    hover:text-blue-600

                    font-medium

                    transition
                  "
                >
                  Cart
                </Link>
              </>
            )}

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* DARK MODE */}

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="
              w-11 h-11

              rounded-full

              bg-white/70
              dark:bg-gray-800/70

              backdrop-blur-md

              border border-gray-200/70
              dark:border-gray-700/50

              flex items-center justify-center

              text-gray-700
              dark:text-gray-200

              hover:scale-105
              hover:shadow-lg

              transition-all duration-300
            "
          >

            {
              darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )
            }

          </button>

          {/* LOGIN */}

          {!isAuthenticated ? (

            <Link
              to="/login"
              className="
                px-5 py-2.5

                rounded-xl

                bg-blue-600
                hover:bg-blue-700

                text-white

                font-semibold

                transition
              "
            >
              Login
            </Link>

          ) : (

            /* USER MENU */

            <div
              className="relative"
              ref={dropdownRef}
            >

              <button
                onClick={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                className="
                  flex items-center gap-3

                  pl-2 pr-3 py-2

                  rounded-full

                  bg-white/70
                  dark:bg-gray-800/70

                  backdrop-blur-md

                  border border-gray-200/70
                  dark:border-gray-700/50

                  hover:shadow-xl
                  hover:scale-[1.02]

                  transition-all duration-300
                "
              >

                {/* AVATAR */}

                {
                  user?.avatar ? (

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="
                        w-10 h-10

                        rounded-full

                        object-cover

                        ring-2 ring-white
                        dark:ring-gray-900
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-10 h-10

                        rounded-full

                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600

                        flex items-center justify-center

                        text-white

                        font-semibold
                      "
                    >
                      {user?.name?.charAt(0)}
                    </div>

                  )
                }

                {/* TEXT */}

                <div
                  className="
                    hidden md:block

                    text-left
                  "
                >

                  <p
                    className="
                      text-sm font-semibold

                      text-gray-800
                      dark:text-white

                      leading-none
                    "
                  >
                    {user?.name}
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs

                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {user?.role}
                  </p>

                </div>

                {/* ICON */}

                <ChevronDown
                  size={16}
                  className="
                    text-gray-500
                  "
                />

              </button>

              {/* DROPDOWN */}

              {
                showDropdown && (

                  <div
                    className="
                      absolute right-0 top-16

                      w-64

                      bg-white dark:bg-gray-800

                      border border-gray-200/70
                      dark:border-gray-700/50

                      rounded-2xl

                      shadow-2xl
                      shadow-black/10
                      dark:shadow-black/40

                      overflow-hidden
                    "
                  >

                    {/* USER LINKS */}

                    <div className="p-2">

                      <Link
                        to="/profile"
                        className="
                          block

                          px-4 py-3

                          rounded-xl

                          text-gray-700
                          dark:text-gray-200

                          hover:bg-gray-100
                          dark:hover:bg-gray-700/70

                          transition
                        "
                      >
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="
                          block

                          px-4 py-3

                          rounded-xl

                          text-gray-700
                          dark:text-gray-200

                          hover:bg-gray-100
                          dark:hover:bg-gray-700/70

                          transition
                        "
                      >
                        Orders
                      </Link>

                      <Link
                        to="/checkout"
                        className="
                          block

                          px-4 py-3

                          rounded-xl

                          text-gray-700
                          dark:text-gray-200

                          hover:bg-gray-100
                          dark:hover:bg-gray-700/70

                          transition
                        "
                      >
                        Checkout
                      </Link>

                    </div>

                    {/* ADMIN SECTION */}

                    {
                      user?.role === "admin" && (

                        <>

                          <div
                            className="
                              border-t
                              border-gray-200/70
                              dark:border-gray-700/50
                            "
                          />

                          <div className="p-2">

                            <p
                              className="
                                px-4 py-2

                                text-xs font-bold

                                text-gray-400

                                uppercase
                              "
                            >
                              Admin
                            </p>

                            <Link
                              to="/admin"
                              className="
                                block

                                px-4 py-3

                                rounded-xl

                                text-gray-700
                                dark:text-gray-200

                                hover:bg-gray-100
                                dark:hover:bg-gray-700/70

                                transition
                              "
                            >
                              Dashboard
                            </Link>

                            <Link
                              to="/admin/products"
                              className="
                                block

                                px-4 py-3

                                rounded-xl

                                text-gray-700
                                dark:text-gray-200

                                hover:bg-gray-100
                                dark:hover:bg-gray-700/70

                                transition
                              "
                            >
                              Manage Products
                            </Link>

                            <Link
                              to="/admin/orders"
                              className="
                                block

                                px-4 py-3

                                rounded-xl

                                text-gray-700
                                dark:text-gray-200

                                hover:bg-gray-100
                                dark:hover:bg-gray-700/70

                                transition
                              "
                            >
                              Manage Orders
                            </Link>

                          </div>

                        </>

                      )
                    }

                    {/* LOGOUT */}

                    <div
                      className="
                        border-t
                        border-gray-200/70
                        dark:border-gray-700/50

                        p-2
                      "
                    >

                      <button
                        onClick={handleLogout}
                        className="
                          w-full

                          text-left

                          px-4 py-3

                          rounded-xl

                          text-red-500

                          hover:bg-red-50
                          dark:hover:bg-red-500/10

                          transition
                        "
                      >
                        Logout
                      </button>

                    </div>

                  </div>

                )
              }

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
