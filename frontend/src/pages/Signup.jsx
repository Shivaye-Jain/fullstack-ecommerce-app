import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSignup = async () => {

    setError("");

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name,
          email,
          phone,
          password,
        }
      );

      navigate("/login");

    } catch (err) {

      console.log(err);

      setError(
        err?.response?.data?.error ||
        "Signup failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100 dark:bg-gray-900

        flex items-center justify-center

        px-4
      "
    >

      <div
        className="
          w-full max-w-md

          bg-white dark:bg-gray-800

          rounded-3xl

          shadow-2xl

          p-8 sm:p-10

          border border-gray-100 dark:border-gray-700
        "
      >

        {/* LOGO */}

        <div className="flex justify-center">

          <div
            className="
              w-16 h-16

              rounded-2xl

              bg-blue-600

              flex items-center justify-center

              text-white

              text-2xl font-bold
            "
          >
            M
          </div>

        </div>

        {/* HEADING */}

        <div className="mt-6 text-center">

          <h1
            className="
              text-3xl font-bold

              text-gray-800 dark:text-white
            "
          >
            Create Account
          </h1>

          <p
            className="
              mt-2

              text-gray-500 dark:text-gray-400
            "
          >
            Join MyStore and start shopping today
          </p>

        </div>

        {/* ERROR */}

        {error && (

          <div
            className="
              mt-6

              bg-red-100 dark:bg-red-500/10

              border border-red-200 dark:border-red-500/20

              text-red-600 dark:text-red-400

              px-4 py-3

              rounded-xl

              text-sm
            "
          >
            {error}
          </div>

        )}

        {/* FORM */}

        <div className="mt-8 space-y-5">

          {/* NAME */}

          <div>

            <label
              className="
                block

                text-sm font-medium

                text-gray-700 dark:text-gray-300

                mb-2
              "
            >
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full

                px-4 py-3

                rounded-xl

                border border-gray-300
                dark:border-gray-600

                dark:bg-gray-700
                dark:text-white

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>

          {/* EMAIL */}

          <div>

            <label
              className="
                block

                text-sm font-medium

                text-gray-700 dark:text-gray-300

                mb-2
              "
            >
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full

                px-4 py-3

                rounded-xl

                border border-gray-300
                dark:border-gray-600

                dark:bg-gray-700
                dark:text-white

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>

          {/* PHONE */}

          <div>

            <label
              className="
                block

                text-sm font-medium

                text-gray-700 dark:text-gray-300

                mb-2
              "
            >
              Phone Number
            </label>

            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="
                w-full

                px-4 py-3

                rounded-xl

                border border-gray-300
                dark:border-gray-600

                dark:bg-gray-700
                dark:text-white

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label
              className="
                block

                text-sm font-medium

                text-gray-700 dark:text-gray-300

                mb-2
              "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full

                px-4 py-3

                rounded-xl

                border border-gray-300
                dark:border-gray-600

                dark:bg-gray-700
                dark:text-white

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label
              className="
                block

                text-sm font-medium

                text-gray-700 dark:text-gray-300

                mb-2
              "
            >
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="
                w-full

                px-4 py-3

                rounded-xl

                border border-gray-300
                dark:border-gray-600

                dark:bg-gray-700
                dark:text-white

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="
              w-full

              bg-blue-600
              hover:bg-blue-700

              disabled:opacity-70

              text-white

              py-3.5

              rounded-xl

              font-semibold

              transition

              shadow-lg shadow-blue-500/20
            "
          >
            {
              loading
                ? "Creating Account..."
                : "Create Account"
            }
          </button>

        </div>

        {/* LOGIN LINK */}

        <p
          className="
            mt-8

            text-center

            text-sm

            text-gray-500 dark:text-gray-400
          "
        >
          Already have an account?{" "}

          <Link
            to="/login"
            className="
              text-blue-600
              hover:text-blue-700

              font-semibold
            "
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;