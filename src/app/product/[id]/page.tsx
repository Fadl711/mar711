"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  image_url: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  category: string;
  badge?: string;
  material?: string;
  cart_count: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    }
    fetch();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      selectedSize,
      selectedColor,
      quantity: 1,
    });

    try {
      await supabase.rpc("increment_cart_count", { product_id: product.id });
    } catch {
      // ignore
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-4xl">👗</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">المنتج غير موجود</p>
        <Link href="/" className="text-pink-500 text-sm font-medium">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const discount = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      )
    : 0;

  // Build gallery: use images array if available, else fallback to image_url
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="text-gray-600 text-xl">
          →
        </button>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 text-xl">♡</button>
          <Link href="/cart" className="text-gray-500 text-xl">
            🛒
          </Link>
        </div>
      </div>

      {/* Desktop: Side by side */}
      <div className="max-w-7xl mx-auto md:flex md:gap-10 md:px-8">
        {/* Image Gallery */}
        <div className="md:w-1/2 md:my-4 md:sticky md:top-20 md:self-start">
          {/* Main Image */}
          <div className="relative aspect-square bg-gradient-to-b from-pink-50 to-gray-50 overflow-hidden md:rounded-3xl">
            {galleryImages.length > 0 ? (
              <Image
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl text-gray-200">
                👗
              </div>
            )}

            {product.material && (
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs text-green-600 px-3 py-1 rounded-full flex items-center gap-1">
                ✅ {product.material}
              </div>
            )}

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 px-4 md:px-0 mt-3 overflow-x-auto hide-scrollbar pb-1">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === index
                      ? "border-pink-400 shadow-md scale-105"
                      : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`صورة ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 pt-4 md:w-1/2 md:py-6 md:px-0">
          {product.badge && (
            <span className="text-pink-500 text-[11px] md:text-xs font-bold uppercase tracking-wider">
              {product.badge}
            </span>
          )}

          <div className="flex items-start justify-between mt-1 mb-2">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex-1">
              {product.name}
            </h1>
            <div className="text-left mr-4">
              <span className="text-green-500 font-bold text-xl md:text-2xl">
                {product.price}
              </span>
              <span className="text-gray-400 text-xs block">ر.س</span>
              {product.old_price && (
                <span className="text-gray-300 text-xs line-through">
                  {product.old_price} ر.س
                </span>
              )}
            </div>
          </div>

          {discount > 0 && (
            <span className="inline-block bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
              خصم {discount}%
            </span>
          )}

          {product.description && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">اللون</h3>
                <span className="text-xs text-gray-400">{selectedColor}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border-2 transition-all ${
                      selectedColor === color
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                المقاس
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 md:w-14 md:h-14 rounded-full text-xs md:text-sm font-semibold border-2 transition-all ${
                      selectedSize === size
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Add to Cart */}
          <div className="hidden md:block mt-6">
            <button
              onClick={handleAddToCart}
              className={`w-full max-w-md py-4 rounded-2xl font-bold text-white text-sm shadow-lg transition-all ${
                added
                  ? "bg-green-400 scale-95"
                  : "bg-gradient-to-l from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 active:scale-95"
              }`}
            >
              {added ? "✅ تمت الإضافة!" : "🛒 أضف للسلة"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 bg-gradient-to-t from-white via-white to-transparent pt-4 md:hidden">
        <button
          onClick={handleAddToCart}
          className={`w-full max-w-lg mx-auto block py-3.5 rounded-2xl font-bold text-white text-sm shadow-lg transition-all ${
            added
              ? "bg-green-400 scale-95"
              : "bg-gradient-to-l from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 active:scale-95"
          }`}
        >
          {added ? "✅ تمت الإضافة!" : "🛒 أضف للسلة"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
