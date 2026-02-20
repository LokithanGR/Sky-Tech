"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, RefreshCcw, Plus, Pencil, Trash2, ImageUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  uploadedAt?: string;
  active?: string | boolean;
};

function normalizeItem(x: any): GalleryItem {
  return {
    id: String(x?.id ?? ""),
    title: String(x?.title ?? ""),
    category: String(x?.category ?? ""),
    imageUrl: String(x?.imageUrl ?? x?.imageURL ?? ""),
    uploadedAt: x?.uploadedAt !== undefined ? String(x.uploadedAt) : "",
    active: x?.active ?? "TRUE",
  };
}

export default function AdminGalleryPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyForm: GalleryItem = useMemo(
    () => ({
      id: "",
      title: "",
      category: "",
      imageUrl: "",
      uploadedAt: "",
      active: "TRUE",
    }),
    []
  );
  const [form, setForm] = useState<GalleryItem>(emptyForm);

  // Optional: Cloudinary unsigned upload (client-side)
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
  const canUploadFile = Boolean(cloud && preset);

  async function loadItems() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (r.status === 401) {
        setAuthed(false);
        setItems([]);
        return;
      }
      const list = Array.isArray(j?.items) ? j.items.map(normalizeItem) : [];
      setItems(list);
    } catch {
      alert("Failed to load gallery. Check Apps Script 🛠️");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (r.ok) {
      setAuthed(true);
      await loadItems();
    } else {
      alert("Wrong password macha 😅");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function save(action: "add" | "update" | "delete") {
    const r = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload: form }),
    });
    const j = await r.json().catch(() => ({ ok: false, message: "Invalid response" }));

    if (!j.ok) {
      alert(j.message || "Something went wrong");
      return;
    }
    setForm(emptyForm);
    await loadItems();
  }

  async function uploadToCloudinary(file: File) {
    if (!canUploadFile) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);

    const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: fd,
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || "Upload failed");
    return String(j.secure_url || j.url || "");
  }

  async function onPickFile(f: File | null) {
    if (!f) return;
    if (!canUploadFile) {
      alert("Cloudinary env missing. Use Image URL input 😅");
      return;
    }
    try {
      const url = await uploadToCloudinary(f);
      setForm((p) => ({ ...p, imageUrl: url }));
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    }
  }

  useEffect(() => {
    // If cookie already exists, list call will succeed; else it will 401.
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl border grid place-items-center">
              <ShieldCheck />
            </div>
            <div>
              <div className="text-xs text-gray-500">Sky Tech • Admin</div>
              <h1 className="text-3xl font-bold">Gallery Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="underline">Offers</Link>
            <span className="text-gray-400">•</span>
            <Link href="/" className="underline">Back to website</Link>
          </div>
        </div>

        {!authed ? (
          <div className="mt-8 rounded-[2rem] border p-8 bg-gray-50">
            <div className="font-semibold">Admin Login</div>
            <input
              className="mt-3 w-full border rounded-2xl px-4 py-3 bg-white"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white font-semibold"
              onClick={login}
            >
              <LogIn size={18} /> Login
            </motion.button>
            <div className="text-xs text-gray-500 mt-3">
              Login pannina apram thaan upload/edit/delete ✅
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50"
                onClick={loadItems}
              >
                <RefreshCcw size={16} /> {loading ? "Loading..." : "Refresh"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50"
                onClick={logout}
              >
                <LogOut size={16} /> Logout
              </motion.button>
            </div>

            <div className="mt-6 grid lg:grid-cols-2 gap-4">
              <div className="rounded-[2rem] border p-7">
                <div className="font-semibold text-lg">Photo Details</div>
                <div className="mt-4 grid gap-3">
                  <input
                    className="border rounded-2xl px-4 py-3"
                    placeholder="id (unique)"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                  />
                  <input
                    className="border rounded-2xl px-4 py-3"
                    placeholder="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <input
                    className="border rounded-2xl px-4 py-3"
                    placeholder="category (CCTV / Inverter / Water Purifier...)"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />

                  <div className="grid gap-2">
                    <input
                      className="border rounded-2xl px-4 py-3"
                      placeholder="Image URL (required)"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />

                    <div className="text-xs text-gray-500">
                      {canUploadFile
                        ? "Or choose file (Cloudinary) 👇"
                        : "File upload venumna Cloudinary env set pannunga. Illaina image URL paste pannunga 😄"}
                    </div>

                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50 w-fit cursor-pointer">
                      <ImageUp size={16} />
                      <span className="text-sm">Choose Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <select
                    className="border rounded-2xl px-4 py-3"
                    value={String(form.active ?? "TRUE")}
                    onChange={(e) => setForm({ ...form, active: e.target.value })}
                  >
                    <option value="TRUE">Visible</option>
                    <option value="FALSE">Hidden</option>
                  </select>

                  <div className="mt-1 flex flex-wrap gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black text-white font-semibold"
                      onClick={() => save("add")}
                    >
                      <Plus size={16} /> Add
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50 font-semibold"
                      onClick={() => save("update")}
                    >
                      <Pencil size={16} /> Update
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50 font-semibold"
                      onClick={() => save("delete")}
                    >
                      <Trash2 size={16} /> Delete
                    </motion.button>
                  </div>

                  <div className="text-xs text-gray-500">
                    Delete/Update ku <b>id</b> correct-a irukanum ✅
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border p-7">
                <div className="font-semibold text-lg">Current Gallery</div>
                <div className="mt-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-sm text-gray-600">{loading ? "Loading..." : "No photos"}</div>
                  ) : (
                    items.map((it) => (
                      <button
                        key={it.id}
                        className="w-full text-left rounded-3xl border p-4 hover:bg-gray-50"
                        onClick={() => setForm({ ...it })}
                      >
                        <div className="font-semibold">{it.title || "Work Photo"}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {it.category || "Others"} • {String(it.active ?? "TRUE").toUpperCase() === "TRUE" ? "Visible" : "Hidden"}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">ID: {it.id}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
