"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

const ALL_SIZES = [
  "0-3M",
  "3-6M",
  "6-12M",
  "1-2Y",
  "2-3Y",
  "3-4Y",
  "4-5Y",
  "5-6Y",
  "6-7Y",
  "7-8Y",
];

interface ImageItem {
  file: File | null;
  preview: string;
  url: string;
  isDefault: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    category: "",
    sizes: [] as string[],
    colors: [] as string[],
    badge: "",
    material: "",
    image_url: "",
  });
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    async function fetch() {
      const [{ data: cats }, { data: product }] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("products").select("*").eq("id", params.id).single(),
      ]);
      setCategories(cats || []);
      if (product) {
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price || ""),
          old_price: product.old_price ? String(product.old_price) : "",
          category: product.category || "",
          sizes: product.sizes || [],
          colors: product.colors || [],
          badge: product.badge || "",
          material: product.material || "",
          image_url: product.image_url || "",
        });
        // Load existing images
        const existingImages: string[] = product.images || [];
        if (existingImages.length > 0) {
          setImageItems(
            existingImages.map((url) => ({
              file: null,
              preview: url,
              url,
              isDefault: url === product.image_url,
            }))
          );
        } else if (product.image_url) {
          // Legacy: only image_url exists
          setImageItems([
            {
              file: null,
              preview: product.image_url,
              url: product.image_url,
              isDefault: true,
            },
          ]);
        }
      }
      setFetching(false);
    }
    fetch();
  }, [params.id]);

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !form.colors.includes(colorInput.trim())) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: ImageItem[] = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      url: "",
      isDefault: imageItems.length === 0 && i === 0,
    }));
    setImageItems((prev) => [...prev, ...newItems]);
  };

  const removeImage = (index: number) => {
    setImageItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].isDefault && updated.length > 0) {
        updated[0].isDefault = true;
      }
      return updated;
    });
  };

  const setDefaultImage = (index: number) => {
    setImageItems((prev) =>
      prev.map((item, i) => ({ ...item, isDefault: i === index }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("يرجى إدخال اسم المنتج والسعر");
    setLoading(true);

    // Upload new images, keep existing URLs
    const uploadedUrls: string[] = [];
    for (const item of imageItems) {
      if (item.file) {
        const fileExt = item.file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, item.file);
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(uploadData.path);
          uploadedUrls.push(urlData.publicUrl);
        }
      } else if (item.url) {
        uploadedUrls.push(item.url);
      }
    }

    const defaultIndex = imageItems.findIndex((item) => item.isDefault);
    const image_url = uploadedUrls[defaultIndex] || uploadedUrls[0] || "";

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        category: form.category,
        sizes: form.sizes,
        colors: form.colors,
        badge: form.badge || null,
        material: form.material || null,
        image_url,
        images: uploadedUrls,
      })
      .eq("id", params.id);

    setLoading(false);
    if (error) {
      alert("حدث خطأ: " + error.message);
    } else {
      router.push("/admin/products");
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-2xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-600 text-xl">
          →
        </button>
        <h1 className="text-lg font-bold text-gray-800">تعديل المنتج</h1>
        <div className="w-6" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto px-4 pt-5 space-y-5"
      >
        {/* Multi Image Upload */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            صور المنتج
          </label>
          <p className="text-[10px] text-gray-400 mb-2">
            اضغط على الصورة لجعلها الافتراضية (⭐)
          </p>
          <div className="flex gap-2 flex-wrap">
            <label className="w-20 h-20 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0">
              <span className="text-xl text-blue-400">📷</span>
              <span className="text-[9px] text-blue-400 mt-0.5">إضافة صور</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            {imageItems.map((item, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer border-2 transition-all ${
                  item.isDefault
                    ? "border-yellow-400 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setDefaultImage(index)}
              >
                <img
                  src={item.preview}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {item.isDefault && (
                  <div className="absolute top-0.5 right-0.5 bg-yellow-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    ⭐
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            اسم المنتج *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            القسم
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              السعر (ر.س) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              السعر القديم
            </label>
            <input
              type="number"
              value={form.old_price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, old_price: e.target.value }))
              }
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            المقاسات المتاحة
          </label>
          <div className="flex gap-2 flex-wrap">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  form.sizes.includes(size)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            الألوان
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.colors.map((color) => (
              <span
                key={color}
                className="bg-pink-50 text-pink-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-pink-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
              placeholder="إضافة لون"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={addColor}
              className="bg-gray-100 text-gray-600 px-4 rounded-xl text-sm font-medium"
            >
              إضافة
            </button>
          </div>
        </div>

        {/* Badge & Material */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              شارة
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, badge: e.target.value }))
              }
              placeholder="جديد"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              الخامة
            </label>
            <input
              type="text"
              value={form.material}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, material: e.target.value }))
              }
              placeholder="قطن 100%"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            الوصف
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            maxLength={500}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
        >
          {loading ? "⏳ جاري الحفظ..." : "✅ حفظ التعديلات"}
        </button>
      </form>

      <AdminNav />
    </div>
  );
}
