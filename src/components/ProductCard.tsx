"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      selectedSize: product.sizes?.[0] || "",
      selectedColor: product.colors?.[0] || "",
      quantity: 1,
    });

    // Increment cart_count in Supabase
    try {
      await supabase.rpc("increment_cart_count", { product_id: product.id });
    } catch {
      // ignore tracking errors
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-pink-50 to-gray-50 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">
              👗
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              {product.badge}
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
          >
            ♡
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-400 mb-2">{product.category}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-pink-500 font-bold text-sm">
                {product.price} ر.س
              </span>
              {product.old_price && (
                <span className="text-gray-300 text-xs line-through">
                  {product.old_price} ر.س
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-7 h-7 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
