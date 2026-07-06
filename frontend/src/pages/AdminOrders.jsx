import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();

    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-500/15",
          text: "text-yellow-300",
          border: "border-yellow-500/20",
          icon: <Clock3 size={14} />,
        };

      case "shipped":
        return {
          bg: "bg-blue-500/15",
          text: "text-blue-300",
          border: "border-blue-500/20",
          icon: <Truck size={14} />,
        };

      case "delivered":
        return {
          bg: "bg-green-500/15",
          text: "text-green-300",
          border: "border-green-500/20",
          icon: <CheckCircle2 size={14} />,
        };

      case "cancelled":
        return {
          bg: "bg-red-500/15",
          text: "text-red-300",
          border: "border-red-500/20",
          icon: <XCircle size={14} />,
        };

      default:
        return {
          bg: "bg-white/10",
          text: "text-white",
          border: "border-white/10",
          icon: <Package size={14} />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute

            top-0 left-1/4

            w-[500px] h-[500px]

            bg-blue-500/20

            blur-[120px]

            rounded-full
          "
        />

        <div
          className="
            absolute

            bottom-0 right-1/4

            w-[500px] h-[500px]

            bg-purple-500/20

            blur-[120px]

            rounded-full
          "
        />
      </div>

      <div className="p-4 sm:p-6 lg:p-10">
        {/* HEADER */}
        <div className="mb-12">
          <div
            className="
              inline-flex items-center gap-2

              px-4 py-2

              rounded-full

              bg-white/5

              border border-white/10

              backdrop-blur-xl

              text-sm text-white/70
            "
          >
            <Package size={16} />
            Order Management
          </div>

          <h1
            className="
              text-5xl font-bold

              mt-6

              tracking-tight
            "
          >
            Orders Dashboard
          </h1>

          <p
            className="
              text-white/60

              mt-4

              text-lg

              max-w-2xl
            "
          >
            Manage customer purchases, monitor deliveries
            and control operational workflows in real-time.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div
            className="
              bg-white/5

              backdrop-blur-2xl

              border border-white/10

              rounded-[32px]

              p-20

              text-center
            "
          >
            <Package
              size={60}
              className="mx-auto text-white/40"
            />

            <h2 className="text-3xl font-bold mt-8">
              No Orders Yet
            </h2>

            <p className="text-white/60 mt-4">
              Orders will appear here once customers
              begin purchasing products.
            </p>
          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-8">
          {orders.map((order) => {
            const statusStyle = getStatusStyles(order.status);

            return (
              <div
                key={order.id}
                className="
                  group

                  bg-white/5

                  backdrop-blur-2xl

                  border border-white/10

                  rounded-[32px]

                  overflow-hidden

                  hover:border-blue-500/20

                  hover:-translate-y-1

                  transition-all duration-300
                "
              >
                {/* TOP SECTION */}
                <div
                  className="
                    p-6 lg:p-7

                    border-b border-white/10
                  "
                >
                  <div
                    className="
                      flex flex-col xl:flex-row

                      xl:items-center
                      xl:justify-between

                      gap-6
                    "
                  >
                    {/* LEFT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* ORDER ID */}
                        <h2
                          className="
                            text-3xl font-bold

                            tracking-tight
                          "
                        >
                          Order #{order.id}
                        </h2>

                        {/* STATUS BADGE */}
                        <div
                          className={`
                            flex items-center gap-2

                            px-4 py-2

                            rounded-full

                            text-xs font-semibold

                            border

                            backdrop-blur-xl

                            ${statusStyle.bg}
                            ${statusStyle.text}
                            ${statusStyle.border}
                          `}
                        >
                          {statusStyle.icon}

                          <span className="capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* EMAIL */}
                      <p
                        className="
                          text-white/60

                          mt-4

                          truncate
                        "
                      >
                        {order.email}
                      </p>

                      {/* DATE */}
                      <p
                        className="
                          text-sm text-white/40

                          mt-2
                        "
                      >
                        {new Date(order.created_at).toLocaleString(
                          "en-IN",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div
                      className="
                        flex items-center

                        gap-4

                        shrink-0
                      "
                    >
                      {/* TOTAL */}
                      <div
                        className="
                          px-5 py-4

                          rounded-2xl

                          bg-white/[0.04]

                          border border-white/10

                          backdrop-blur-xl

                          min-w-[170px]
                        "
                      >
                        <p className="text-xs text-white/40 uppercase tracking-wide">
                          Total
                        </p>

                        <h3
                          className="
                            text-2xl font-bold

                            mt-1
                          "
                        >
                          ₹{order.total}
                        </h3>
                      </div>

                      {/* STATUS SELECT */}
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="
                            h-[68px]

                            px-5

                            rounded-2xl

                            bg-white/[0.04]

                            border border-white/10

                            backdrop-blur-xl

                            text-white

                            font-medium

                            min-w-[190px]

                            outline-none

                            focus:border-blue-500/40

                            transition-all

                            appearance-none
                          "
                        >
                          <option
                            value="pending"
                            className="bg-[#0b1020]"
                          >
                            Pending
                          </option>

                          <option
                            value="shipped"
                            className="bg-[#0b1020]"
                          >
                            Shipped
                          </option>

                          <option
                            value="delivered"
                            className="bg-[#0b1020]"
                          >
                            Delivered
                          </option>

                          <option
                            value="cancelled"
                            className="bg-[#0b1020]"
                          >
                            Cancelled
                          </option>
                        </select>

                        {/* CUSTOM ARROW */}
                        <div
                          className="
                            absolute

                            right-4 top-1/2

                            -translate-y-1/2

                            pointer-events-none

                            text-white/40
                          "
                        >
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="p-8">
                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="
                          flex flex-col lg:flex-row

                          lg:items-center

                          gap-6

                          p-5

                          rounded-3xl

                          bg-white/[0.03]

                          border border-white/[0.06]

                          hover:bg-white/[0.05]

                          transition-all
                        "
                      >
                        {/* IMAGE */}
                        <div
                          className="
                            p-1

                            rounded-3xl

                            bg-white/5

                            border border-white/10
                          "
                        >
                          <img
                            src={item.images?.[0]}
                            alt={item.name}
                            className="
                              w-28 h-28

                              object-cover

                              rounded-[20px]
                            "
                          />
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                          <h3
                            className="
                              text-xl font-semibold
                            "
                          >
                            {item.name}
                          </h3>

                          <div
                            className="
                              flex items-center gap-6

                              mt-4

                              text-sm text-white/50
                            "
                          >
                            <p>
                              Qty:
                              <span className="ml-2 text-white">
                                {item.quantity}
                              </span>
                            </p>

                            <p>
                              Price:
                              <span className="ml-2 text-white">
                                ₹{item.price}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="text-right">
                          <p className="text-sm text-white/40">
                            Item Total
                          </p>

                          <h3
                            className="
                              text-3xl font-bold

                              mt-2
                            "
                          >
                            ₹
                            {item.price *
                              item.quantity}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;