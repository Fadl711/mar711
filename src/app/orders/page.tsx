"use client";

import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-600 text-xl">
          →
        </button>
        <h1 className="text-lg font-bold text-gray-800">طلباتي</h1>
        <div className="w-6" />
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8 flex flex-col items-center justify-center text-center py-16">
        <p className="text-5xl mb-4">📋</p>
        <h2 className="text-lg font-bold text-gray-700 mb-2">لا توجد طلبات</h2>
        <p className="text-sm text-gray-400">
          طلباتك عبر واتساب ستظهر هنا قريباً
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
