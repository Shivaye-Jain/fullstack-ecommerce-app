import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [avatarLoading, setAvatarLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);

  const [preview, setPreview] = useState("");

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        {
          name: editName,
          phone: editPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser({
        ...user,
        name: editName,
        phone: editPhone,
      });

      setShowEditModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadAvatar = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setAvatarLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("avatar", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (err) {
      console.log(err);
    } finally {
      setAvatarLoading(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/profile/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-100 dark:bg-gray-900
        p-4 sm:p-6 lg:p-8
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto
          grid
          grid-cols-1 lg:grid-cols-4
          gap-8
        "
      >
        {/* SIDEBAR */}

        <div
          className="
            bg-white dark:bg-gray-800
            rounded-3xl
            p-6
            shadow-sm
            border border-gray-100 dark:border-gray-700
            h-fit
          "
        >
          <div className="flex flex-col items-center">
            <div
              className="
                w-24 h-24
                rounded-full
                bg-blue-600
                flex items-center justify-center
                text-white
                text-3xl font-bold
              "
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="
        w-24 h-24
        rounded-full
        object-cover
      "
                />
              ) : (
                <div
                  className="
        w-24 h-24
        rounded-full
        bg-blue-600
        flex items-center justify-center
        text-white
        text-3xl font-bold
      "
                >
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <label className=" mt-5 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-sm font-medium transition-all ">
              {avatarLoading ? "Uploading..." : "Change Photo"}{" "}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={uploadAvatar}
              />
            </label>
            <h2
              className="
                mt-4
                text-xl font-bold
                text-gray-800 dark:text-white
              "
            >
              {user.name}
            </h2>

            <p
              className="
                text-sm
                text-gray-500 dark:text-gray-400
                mt-1
              "
            >
              {user.email}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              to="/profile"
              className="
      block
      w-full
      px-4 py-3
      rounded-xl
      bg-blue-50 dark:bg-blue-500/10
      text-blue-600
      font-medium
    "
            >
              Profile
            </Link>

            <Link
              to="/orders"
              className="
      block
      w-full
      px-4 py-3
      rounded-xl
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      text-gray-700 dark:text-gray-200
    "
            >
              Orders
            </Link>

            <Link
              to="/wishlist"
              className="
      block
      w-full
      px-4 py-3
      rounded-xl
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      text-gray-700 dark:text-gray-200
    "
            >
              Wishlist
            </Link>

            <Link
              to="/checkout"
              className="
      block
      w-full
      px-4 py-3
      rounded-xl
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition
      text-gray-700 dark:text-gray-200
    "
            >
              Addresses
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="lg:col-span-3 space-y-8">
          {/* PROFILE CARD */}

          <div
            className="
              bg-white dark:bg-gray-800
              rounded-3xl
              p-8
              shadow-sm
              border border-gray-100 dark:border-gray-700
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <h1
                  className="
                    text-3xl font-bold
                    text-gray-800 dark:text-white
                  "
                >
                  My Profile
                </h1>

                <p
                  className="
                    mt-2
                    text-gray-500 dark:text-gray-400
                  "
                >
                  Manage your account information
                </p>
              </div>

              <button
                className="
                  px-5 py-2.5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-medium
                  transition
                "
                onClick={() => {
                  setEditName(user.name || "");

                  setEditPhone(user.phone || "");

                  setShowEditModal(true);
                }}
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500 dark:text-gray-400
                  "
                >
                  Full Name
                </p>

                <h3
                  className="
                    mt-2
                    text-lg font-semibold
                    text-gray-800 dark:text-white
                  "
                >
                  {user.name}
                </h3>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    text-gray-500 dark:text-gray-400
                  "
                >
                  Email Address
                </p>

                <h3
                  className="
                    mt-2
                    text-lg font-semibold
                    text-gray-800 dark:text-white
                  "
                >
                  {user.email}
                </h3>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    text-gray-500 dark:text-gray-400
                  "
                >
                  Role
                </p>

                <h3
                  className="
                    mt-2
                    text-lg font-semibold
                    capitalize
                    text-gray-800 dark:text-white
                  "
                >
                  {user.role}
                </h3>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    text-gray-500 dark:text-gray-400
                  "
                >
                  Joined
                </p>

                <h3
                  className="
                    mt-2
                    text-lg font-semibold
                    text-gray-800 dark:text-white
                  "
                >
                  {new Date(user.created_at).toLocaleDateString()}
                </h3>
              </div>
            </div>
          </div>

          {/* ACCOUNT STATS */}

          <div
            className="
              grid
              grid-cols-1 md:grid-cols-3
              gap-6
            "
          >
            <div
              className="
                bg-white dark:bg-gray-800
                rounded-3xl
                p-6
                shadow-sm
                border border-gray-100 dark:border-gray-700
              "
            >
              <p className="text-gray-500 dark:text-gray-400">Total Orders</p>

              <h2
                className="
                  mt-3
                  text-3xl font-bold
                  text-gray-800 dark:text-white
                "
              >
                {stats?.totalOrders || 0}
              </h2>
            </div>

            <div
              className="
                bg-white dark:bg-gray-800
                rounded-3xl
                p-6
                shadow-sm
                border border-gray-100 dark:border-gray-700
              "
            >
              <p className="text-gray-500 dark:text-gray-400">Wishlist Items</p>

              <h2
                className="
                  mt-3
                  text-3xl font-bold
                  text-gray-800 dark:text-white
                "
              >
                {stats?.wishlistItems || 0}
              </h2>
            </div>

            <div
              className="
                bg-white dark:bg-gray-800
                rounded-3xl
                p-6
                shadow-sm
                border border-gray-100 dark:border-gray-700
              "
            >
              <p className="text-gray-500 dark:text-gray-400">
                Saved Addresses
              </p>

              <h2
                className="
                  mt-3
                  text-3xl font-bold
                  text-gray-800 dark:text-white
                "
              >
                {stats?.totalAddresses || 0}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
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
          w-full max-w-md
          bg-white dark:bg-gray-800
          rounded-3xl
          p-8
          shadow-2xl
        "
          >
            <div className="flex justify-between items-center">
              <div>
                <h2
                  className="
                text-2xl font-bold
                text-gray-800 dark:text-white
              "
                >
                  Edit Profile
                </h2>

                <p
                  className="
                mt-1
                text-sm
                text-gray-500 dark:text-gray-400
              "
                >
                  Update your personal information
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(false)}
                className="
              text-gray-500
              hover:text-gray-700
              dark:hover:text-white
              text-2xl
            "
              >
                ×
              </button>
            </div>

            <div className="mt-8 space-y-5">
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
              "
                />
              </div>

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
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
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
              "
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="
              px-5 py-2.5
              rounded-xl
              border
              border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                className="
              px-5 py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
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
    </div>
  );
}

export default Profile;
