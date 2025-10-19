import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Boxes, Shield, FolderCog } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Admins",
      icon: <Shield size={28} />,
      color: "bg-indigo-500",
      action: () => navigate("/dashboard/admins"),
    },
    {
      title: "Manage Categories",
      icon: <FolderCog size={28} />,
      color: "bg-blue-500",
      action: () => navigate("/dashboard/categories"),
    },
    {
      title: "Manage Users",
      icon: <Users size={28} />,
      color: "bg-emerald-500",
      action: () => navigate("/dashboard/users"),
    },
    {
      title: "Manage Products",
      icon: <Boxes size={28} />,
      color: "bg-purple-500",
      action: () => navigate("/dashboard/products"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          ZelZec Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back, manage your system efficiently.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className={`${card.color} cursor-pointer text-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.03] hover:shadow-lg transition-transform`}
          >
            <div className="bg-white/20 p-4 rounded-full">{card.icon}</div>
            <h2 className="text-lg font-semibold text-center">
              {card.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
