import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import {
  Users,
  ShoppingBag,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#ea580c",
  "#dc2626",
  "#0891b2",
];

import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [categoryRevenue, setCategoryRevenue] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/admin/recent-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setRecentOrders(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/admin/top-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTopProducts(res.data));

    axios
      .get("http://localhost:8080/admin/revenue-by-category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCategoryRevenue(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 md:p-10">
        <div className="h-10 w-72 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-40

                rounded-3xl

                bg-white dark:bg-gray-800

                animate-pulse
              "
            />
          ))}
        </div>

        <div
          className="
            mt-10

            h-[450px]

            rounded-3xl

            bg-white dark:bg-gray-800

            animate-pulse
          "
        />

        <div
          className="
            mt-10

            h-[350px]

            rounded-3xl

            bg-white dark:bg-gray-800

            animate-pulse
          "
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Monitor sales, users, orders and overall store performance.
          </p>
        </div>

        <div
          className="
            bg-linear-to-r
            from-blue-600
            to-indigo-600

            text-white

            rounded-2xl

            px-6 py-5

            shadow-lg
          "
        >
          <p className="text-sm opacity-80">Total Revenue</p>

          <h2 className="text-3xl font-bold mt-2">₹{stats.totalRevenue}</h2>

          <div className="flex items-center gap-2 mt-3 text-sm">
            <TrendingUp size={16} />
            Store performing well
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* USERS */}
        <div
          className="
            bg-white dark:bg-gray-900

            rounded-3xl

            p-6

            border border-gray-200 dark:border-gray-800

            shadow-sm hover:shadow-xl

            transition-all duration-300
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Users
              </p>

              <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
                {stats.totalUsers}
              </h2>
            </div>

            <div
              className="
                h-14 w-14

                rounded-2xl

                bg-blue-100 dark:bg-blue-500/20

                flex items-center justify-center
              "
            >
              <Users className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div
          className="
            bg-white dark:bg-gray-900

            rounded-3xl

            p-6

            border border-gray-200 dark:border-gray-800

            shadow-sm hover:shadow-xl

            transition-all duration-300
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Products
              </p>

              <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
                {stats.totalProducts}
              </h2>
            </div>

            <div
              className="
                h-14 w-14

                rounded-2xl

                bg-purple-100 dark:bg-purple-500/20

                flex items-center justify-center
              "
            >
              <ShoppingBag
                className="text-purple-600 dark:text-purple-400"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div
          className="
            bg-white dark:bg-gray-900

            rounded-3xl

            p-6

            border border-gray-200 dark:border-gray-800

            shadow-sm hover:shadow-xl

            transition-all duration-300
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Orders</p>

              <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
                {stats.totalOrders}
              </h2>
            </div>

            <div
              className="
                h-14 w-14

                rounded-2xl

                bg-green-100 dark:bg-green-500/20

                flex items-center justify-center
              "
            >
              <ShoppingCart
                className="text-green-600 dark:text-green-400"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div
          className="
            bg-white dark:bg-gray-900

            rounded-3xl

            p-6

            border border-gray-200 dark:border-gray-800

            shadow-sm hover:shadow-xl

            transition-all duration-300
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Revenue
              </p>

              <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
                ₹{stats.totalRevenue}
              </h2>
            </div>

            <div
              className="
                h-14 w-14

                rounded-2xl

                bg-orange-100 dark:bg-orange-500/20

                flex items-center justify-center
              "
            >
              <IndianRupee
                className="text-orange-600 dark:text-orange-400"
                size={28}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div
        className="
          mt-10

          bg-white dark:bg-gray-900

          rounded-3xl

          p-6 md:p-8

          border border-gray-200 dark:border-gray-800

          shadow-sm
        "
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Revenue Analytics
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Revenue trends over time
            </p>
          </div>
        </div>

        <div className="h-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />

                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.12}
              />

              {/* X AXIS */}
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              {/* Y AXIS */}
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

              {/* TOOLTIP */}
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`₹${value}`, "Revenue"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                }
              />

              {/* AREA */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />

              {/* LINE */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                /* SHOW DATA POINTS */
                dot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                /* ACTIVE HOVER DOT */
                activeDot={{
                  r: 7,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="
    mt-10
    bg-white dark:bg-gray-800
    rounded-3xl
    shadow-sm
    border border-gray-100 dark:border-gray-700
    p-6
  "
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2
              className="
          text-2xl font-bold
          text-gray-800 dark:text-white
        "
            >
              Top Selling Products
            </h2>

            <p
              className="
          text-sm
          text-gray-500 dark:text-gray-400
          mt-1
        "
            >
              Best performing products by sales
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="
          flex items-center justify-between
          bg-gray-50 dark:bg-gray-700/40
          rounded-2xl
          p-4
        "
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
              w-16 h-16
              rounded-xl
              object-cover
            "
                />

                <div>
                  <h3
                    className="
                font-semibold
                text-gray-800 dark:text-white
              "
                  >
                    {product.name}
                  </h3>

                  <p
                    className="
                text-sm
                text-gray-500 dark:text-gray-400
                mt-1
              "
                  >
                    {product.totalSold} units sold
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className="
              text-xl font-bold
              text-gray-800 dark:text-white
            "
                >
                  ₹{product.revenue}
                </p>

                <p
                  className="
              text-sm
              text-green-600
              mt-1
            "
                >
                  Top Performer
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="
    mt-10
    bg-white dark:bg-gray-800
    rounded-3xl
    shadow-sm
    border border-gray-100 dark:border-gray-700
    p-6
  "
      >
        <div className="mb-8">
          <h2
            className="
        text-2xl font-bold
        text-gray-800 dark:text-white
      "
          >
            Revenue By Category
          </h2>

          <p
            className="
        text-sm
        text-gray-500 dark:text-gray-400
        mt-1
      "
          >
            Revenue distribution across categories
          </p>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryRevenue}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={70}
                paddingAngle={4}
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div
        className="
          mt-10

          bg-white dark:bg-gray-900

          rounded-3xl

          p-6 md:p-8

          border border-gray-200 dark:border-gray-800

          shadow-sm
        "
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Orders
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Latest customer purchases
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="
                  border-b border-gray-200 dark:border-gray-800
                "
              >
                <th
                  className="
                    text-left

                    py-4

                    text-sm font-semibold

                    text-gray-500 dark:text-gray-400
                  "
                >
                  Order ID
                </th>

                <th
                  className="
                    text-left

                    py-4

                    text-sm font-semibold

                    text-gray-500 dark:text-gray-400
                  "
                >
                  Total
                </th>

                <th
                  className="
                    text-left

                    py-4

                    text-sm font-semibold

                    text-gray-500 dark:text-gray-400
                  "
                >
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="
                    border-b border-gray-100 dark:border-gray-800

                    hover:bg-gray-50 dark:hover:bg-gray-800/50

                    transition
                  "
                >
                  <td className="py-5 text-gray-800 dark:text-white font-medium">
                    #{order.id}
                  </td>

                  <td className="py-5 text-gray-800 dark:text-white font-semibold">
                    ₹{order.total}
                  </td>

                  <td className="py-5 text-gray-600 dark:text-gray-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
