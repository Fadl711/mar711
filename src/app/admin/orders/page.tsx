"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";

interface WhatsAppClick {
  id: string;
  total_amount: number;
  items_count: number;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [clicks, setClicks] = useState<WhatsAppClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("whatsapp_clicks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setClicks(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-gray-600 text-xl">
          →
        </Link>
        <h1 className="text-lg font-bold text-gray-800">طلبات الواتساب</h1>
        <div className="w-6" />
      </div>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {/* Summary */}
        <div className="bg-green-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-2xl font-extrabold text-gray-800">
              {clicks.length}
            </p>
            <p className="text-[11px] text-gray-500">إجمالي طلبات الواتساب</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : clicks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {clicks.map((click, i) => (
              <div
                key={click.id}
                className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    #{clicks.length - i}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {click.items_count} منتجات
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(click.created_at).toLocaleDateString("ar-SA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-500">
                  {click.total_amount} ر.س
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <AdminNav />
    </div>
  );
}
