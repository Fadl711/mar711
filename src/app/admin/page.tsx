"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { adminLogout } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

interface TopProduct {
  id: string;
  name: string;
  cart_count: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [totalClicks, setTotalClicks] = useState(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  useEffect(() => {
    // Get admin email
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAdminEmail(data.user.email);
    });

    async function fetchStats() {
      // Total WhatsApp clicks
      const { count: clickCount } = await supabase
        .from("whatsapp_clicks")
        .select("*", { count: "exact", head: true });
      setTotalClicks(clickCount || 0);

      // Top 3 products by cart_count
      const { data: topProds } = await supabase
        .from("products")
        .select("id, name, cart_count")
        .order("cart_count", { ascending: false })
        .limit(3);
      setTopProducts(topProds || []);

      // Total products
      const { count: prodCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      setTotalProducts(prodCount || 0);

      // Recent WhatsApp clicks
      const { data: recent } = await supabase
        .from("whatsapp_clicks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentClicks(recent || []);

      setLoading(false);
    }
    fetchStats();
  }, []);

  const quickActions = [
    {
      href: "/admin/products/new",
      label: "إضافة منتج",
      icon: "➕",
      bg: "bg-blue-50",
      iconBg: "text-blue-500",
    },
    {
      href: "/admin/products",
      label: "المنتجات",
      icon: "👗",
      bg: "bg-purple-50",
      iconBg: "text-purple-500",
    },
    {
      href: "/admin/orders",
      label: "الطلبات",
      icon: "📦",
      bg: "bg-green-50",
      iconBg: "text-green-500",
    },
    {
      href: "/",
      label: "المتجر",
      icon: "🏠",
      bg: "bg-amber-50",
      iconBg: "text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-blue-500 font-semibold uppercase tracking-wider">
              لوحة التحكم
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              أهلاً بك 👋
            </h1>
            {adminEmail && (
              <p className="text-[10px] text-gray-400 mt-0.5">{adminEmail}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-full transition-colors"
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 pt-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💬</span>
              <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                واتساب
              </span>
            </div>
            <p className="text-[11px] text-gray-400">إجمالي النقرات</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-0.5">
              {loading ? "..." : totalClicks}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👗</span>
            </div>
            <p className="text-[11px] text-gray-400">إجمالي المنتجات</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-0.5">
              {loading ? "..." : totalProducts}
            </p>
          </div>
        </div>

        {/* Top Products by Cart */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            🔥 الأكثر إضافة للسلة
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl h-14 animate-pulse"
                />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              لا توجد بيانات بعد
            </p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0
                          ? "bg-amber-100 text-amber-600"
                          : i === 1
                          ? "bg-gray-100 text-gray-500"
                          : "bg-orange-50 text-orange-400"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">
                    {p.cart_count} مرة
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.bg} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform`}
              >
                <span className={`text-3xl ${action.iconBg}`}>
                  {action.icon}
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent WhatsApp Clicks */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            آخر طلبات الواتساب
          </h2>
          {recentClicks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              لا توجد طلبات بعد
            </p>
          ) : (
            <div className="space-y-2">
              {recentClicks.map((click) => (
                <div
                  key={click.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-50"
                >
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {click.items_count} منتجات
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(click.created_at).toLocaleDateString("ar-SA", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-500">
                    {click.total_amount} ر.س
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AdminNav />
    </div>
  );
}
