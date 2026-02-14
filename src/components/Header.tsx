"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-lg md:max-w-5xl lg:max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Menu */}
        <button className="text-gray-600 text-xl md:hidden">☰</button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-400 rounded-full flex items-center justify-center text-white text-sm md:text-base font-bold">
            ف
          </div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800">
            فساتينا السعودية
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            الرئيسية
          </Link>
          <Link
            href="/categories"
            className="text-sm text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            الأقسام
          </Link>
          <Link
            href="/orders"
            className="text-sm text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            طلباتي
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-blue-500 font-medium transition-colors"
          >
            لوحة التحكم
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-gray-500 text-lg">🔔</button>
          <Link href="/cart" className="relative text-gray-500 text-lg">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
