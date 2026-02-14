"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { sendWhatsAppOrder } from "@/lib/whatsapp";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    await sendWhatsAppOrder(items, totalPrice);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-20 md:pb-8">
      <Header />

      <main className="max-w-lg md:max-w-5xl lg:max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          سلة التسوق
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-lg font-medium mb-2">السلة فارغة</p>
            <p className="text-sm mb-4">أضيفي بعض المنتجات لبدء التسوق</p>
            <Link
              href="/"
              className="inline-block bg-pink-500 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-pink-600 transition-colors"
            >
              تسوقي الآن 🛍️
            </Link>
          </div>
        ) : (
          <div className="md:flex md:gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-3 mb-6 md:mb-0">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 shadow-sm border border-gray-50"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-200">
                        👗
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex gap-2 mt-0.5 text-[10px] md:text-xs text-gray-400">
                      {item.selectedSize && (
                        <span>المقاس: {item.selectedSize}</span>
                      )}
                      {item.selectedColor && (
                        <span>اللون: {item.selectedColor}</span>
                      )}
                    </div>
                    <p className="text-pink-500 font-bold text-sm md:text-base mt-1">
                      {item.price} ر.س
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(
                                item.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            : removeItem(
                                item.id,
                                item.selectedSize,
                                item.selectedColor
                              )
                        }
                        className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm hover:bg-gray-200 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 text-sm hover:bg-pink-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      removeItem(item.id, item.selectedSize, item.selectedColor)
                    }
                    className="self-start text-gray-300 hover:text-red-400 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:w-80 lg:w-96 md:sticky md:top-20 md:self-start">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">
                  ملخص الطلب
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">عدد المنتجات</span>
                    <span className="text-gray-700 font-medium">
                      {totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">المجموع الفرعي</span>
                    <span className="text-gray-700 font-medium">
                      {totalPrice} ر.س
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">التوصيل</span>
                    <span className="text-green-500 text-xs font-medium">
                      يتم الاتفاق عبر واتساب
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-bold">الإجمالي</span>
                    <span className="text-green-500 font-extrabold text-lg">
                      {totalPrice} ر.س
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white font-bold py-3.5 md:py-4 rounded-2xl shadow-lg hover:bg-green-600 active:scale-[0.98] transition-all text-sm"
                >
                  💬 إتمام الطلب عبر واتساب
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
