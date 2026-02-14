"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/admin",
      label: "الرئيسية",
      icon: "📊",
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "المنتجات",
      icon: "👗",
      active: pathname.startsWith("/admin/products"),
    },
    {
      href: "/admin/orders",
      label: "الطلبات",
      icon: "📦",
      active: pathname === "/admin/orders",
    },
    { href: "/", label: "المتجر", icon: "🏠", active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center max-w-lg mx-auto h-16">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              tab.active
                ? "text-blue-500 scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
