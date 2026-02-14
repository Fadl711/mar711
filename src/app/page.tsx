"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  image_url: string;
  badge?: string;
  sizes: string[];
  colors: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*"),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.category.includes(searchQuery) ||
          (p.badge && p.badge.includes(searchQuery))
      )
    : products;

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-20 md:pb-8">
      <Header />

      <main className="max-w-lg md:max-w-5xl lg:max-w-7xl mx-auto px-4 md:px-8">
        {/* Search Bar */}
        <div className="mt-4 mb-5 max-w-xl md:max-w-2xl mx-auto">
          <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 shadow-sm border border-gray-100">
            <span className="text-gray-300">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن فساتين، مناسبات..."
              className="bg-transparent flex-1 text-sm text-gray-600 outline-none placeholder:text-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-300 hover:text-gray-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Show search results or normal layout */}
        {searchQuery.trim() ? (
          /* Search Results */
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              نتائج البحث عن &quot;{searchQuery}&quot;
              <span className="text-sm text-gray-400 font-normal mr-2">
                ({filteredProducts.length})
              </span>
            </h2>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-sm">لا توجد نتائج</p>
                <p className="text-xs mt-1">جربي كلمات بحث مختلفة</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-l from-pink-200 via-pink-100 to-amber-50 rounded-2xl md:rounded-3xl p-6 md:p-10 mb-6 overflow-hidden min-h-[160px] md:min-h-[220px]">
              <div className="relative z-10 max-w-md">
                <span className="inline-block bg-pink-400 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-2">
                  وصل حديثاً
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-1 leading-tight">
                  تشكيلة العيد
                  <br />
                  الصيفية
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-3">
                  أزياء أنيقة ومرحة لصغيراتك.
                </p>
                <Link
                  href="/categories"
                  className="inline-block bg-white text-gray-700 text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  تسوقي الآن
                </Link>
              </div>
              <div className="absolute left-4 md:left-12 bottom-0 text-7xl md:text-9xl opacity-20">
                👧🏻
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  الأقسام
                </h2>
                <Link
                  href="/categories"
                  className="text-xs md:text-sm text-pink-500 font-medium"
                >
                  عرض الكل
                </Link>
              </div>
              <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-2 md:justify-center md:flex-wrap">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories?cat=${cat.slug}`}
                    className="flex flex-col items-center gap-1 flex-shrink-0"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-50 rounded-full flex items-center justify-center text-2xl md:text-3xl border-2 border-pink-100 hover:border-pink-300 transition-colors">
                      {cat.icon}
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-600 font-medium text-center whitespace-nowrap">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* New Arrivals */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  وصل حديثاً
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl h-64 animate-pulse"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">🛍️</p>
                  <p className="text-sm">لا توجد منتجات حالياً</p>
                  <p className="text-xs mt-1">سيتم إضافة المنتجات قريباً</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Ramadan Banner */}
            <div className="bg-gradient-to-l from-green-100 to-green-50 rounded-2xl md:rounded-3xl p-6 md:p-10 mb-6">
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
                جاهزة لرمضان؟
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">
                أفضل الإطلالات التقليدية لطفلك.
              </p>
              <Link
                href="/categories"
                className="text-xs md:text-sm text-green-600 font-semibold"
              >
                عرض التشكيلة ←
              </Link>
            </div>
          </>
        )}
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "967775376507"
        }`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 left-4 md:left-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors text-white text-xl md:text-2xl"
      >
        💬
      </a>

      <BottomNav />
    </div>
  );
}
