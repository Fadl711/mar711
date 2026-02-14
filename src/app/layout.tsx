import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "فساتينا السعودية | ملابس أطفال",
  description:
    "متجر ملابس أطفال عصري يستهدف السوق السعودي - تشكيلة واسعة من فساتين وأطقم الأطفال",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
