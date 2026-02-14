"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";

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

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  let filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.includes(searchQuery) ||
        p.category.includes(searchQuery) ||
        (p.badge && p.badge.includes(searchQuery))
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-20 md:pb-8">
      <Header />

      <main className="max-w-lg md:max-w-5xl lg:max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          الأقسام
        </h2>

        {/* Search */}
        <div className="mb-4 max-w-xl md:max-w-2xl">
          <div className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm border border-gray-100">
            <span className="text-gray-300">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي في هذا القسم..."
              className="bg-transparent flex-1 text-sm text-gray-600 outline-none placeholder:text-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-300 text-sm hover:text-gray-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-3 mb-4 md:flex-wrap">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
              !selectedCategory
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:border-pink-300"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-pink-300"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-64 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm">لا توجد منتجات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
