import { CartItem } from '@/context/CartContext';
import { supabase } from './supabase';

export function formatWhatsAppMessage(items: CartItem[], total: number): string {
  let message = `🛍️ طلب جديد من متجر فساتينا السعودية\n\n`;
  message += `📦 المنتجات:\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}`;
    if (item.selectedSize) message += ` - المقاس: ${item.selectedSize}`;
    if (item.selectedColor) message += ` - اللون: ${item.selectedColor}`;
    message += ` - الكمية: ${item.quantity}`;
    message += ` - السعر: ${item.price * item.quantity} ر.س\n`;
  });

  message += `\n💰 الإجمالي: ${total} ر.س`;
  message += `\n📍 التوصيل: يحدد لاحقاً`;
  message += `\n\nشكراً لتسوقكم معنا! 🌸`;

  return message;
}

export async function sendWhatsAppOrder(items: CartItem[], total: number) {
  // Track the click in Supabase
  await supabase.from('whatsapp_clicks').insert({
    total_amount: total,
    items_count: items.length,
  });

  const message = formatWhatsAppMessage(items, total);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '967775376507';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
