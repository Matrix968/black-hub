import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      name: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      name: "Customers",
      icon: Users,
      path: "/admin/customers",
    },
    {
      name: "Payments",
      icon: CreditCard,
      path: "/admin/payments",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="w-72 bg-black text-white flex flex-col border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-yellow-400">BLACK HUB</h1>

        <p className="text-sm text-gray-400 mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-5 space-y-2">
        {menus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-yellow-500 text-black font-semibold"
                  : "hover:bg-gray-900"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="m-5 flex items-center justify-center gap-2 rounded-xl bg-red-600 p-3 hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
