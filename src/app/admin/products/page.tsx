"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  cart_count: number;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-gray-600 text-xl">
          →
        </Link>
        <h1 className="text-lg font-bold text-gray-800">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
        >
          + إضافة
        </Link>
      </div>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">لا توجد منتجات</p>
            <Link
              href="/admin/products/new"
              className="text-blue-500 text-sm mt-3 inline-block font-medium"
            >
              أضف أول منتج
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-50"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-gray-200">
                      👗
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-pink-500 font-bold text-sm">
                      {product.price} ر.س
                    </span>
                    <span className="text-[10px] text-gray-300">
                      🛒 {product.cart_count}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 justify-center">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-400 hover:text-blue-600 text-sm transition-colors"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-300 hover:text-red-500 text-sm transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AdminNav />
    </div>
  );
}
