"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, RefreshCcw, Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import Link from "next/link";

type Offer = {
  id: string;
  title: string;
  description: string;
  price?: string;
  validTill?: string;
  active?: string | boolean;
};

function normalizeOffer(o: any): Offer {
  return {
    id: String(o?.id ?? ""),
    title: String(o?.title ?? ""),
    description: String(o?.description ?? ""),
    price: o?.price !== undefined ? String(o.price) : "",
    validTill: o?.validTill !== undefined ? String(o.validTill) : "",
    active: o?.active ?? "TRUE",
  };
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyForm: Offer = useMemo(
    () => ({ id: "", title: "", description: "", price: "", validTill: "", active: "TRUE" }),
    []
  );
  const [form, setForm] = useState<Offer>(emptyForm);

  const offersGetUrl = process.env.NEXT_PUBLIC_OFFERS_API_URL;

  async function loadOffers() {
    if (!offersGetUrl) {
      alert("Missing NEXT_PUBLIC_OFFERS_API_URL in env 😅");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(offersGetUrl, { cache: "no-store" });
      const j = await res.json();
      const list = Array.isArray(j?.offers) ? j.offers.map(normalizeOffer) : [];
      setOffers(list);
    } catch {
      alert("Failed to load offers. Check Apps Script URL 🛠️");
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
      await loadOffers();
    } else {
      alert("Wrong password macha 😅");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function save(action: "add" | "update" | "delete") {
    const r = await fetch("/api/admin/offers", {
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
    await loadOffers();
  }

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
              <h1 className="text-3xl font-bold">Offers Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin/gallery" className="underline">Gallery</Link>
            <span className="text-gray-400">•</span>
            <Link href="/" className="underline">← Back to website</Link>
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
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50"
                onClick={loadOffers}
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
                <div className="font-semibold text-lg">Offer Details</div>
                <div className="mt-4 grid gap-3">
                  <input className="border rounded-2xl px-4 py-3" placeholder="id (unique)"
                    value={form.id} onChange={(e)=>setForm({...form, id:e.target.value})} />
                  <input className="border rounded-2xl px-4 py-3" placeholder="title"
                    value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
                  <textarea className="border rounded-2xl px-4 py-3" placeholder="description" rows={4}
                    value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="border rounded-2xl px-4 py-3" placeholder="price (optional)"
                      value={form.price || ""} onChange={(e)=>setForm({...form, price:e.target.value})} />
                    <input className="border rounded-2xl px-4 py-3" placeholder="validTill (YYYY-MM-DD)"
                      value={form.validTill || ""} onChange={(e)=>setForm({...form, validTill:e.target.value})} />
                  </div>
                  <select className="border rounded-2xl px-4 py-3"
                    value={String(form.active ?? "TRUE")}
                    onChange={(e)=>setForm({...form, active:e.target.value})}>
                    <option value="TRUE">Active</option>
                    <option value="FALSE">Inactive</option>
                  </select>

                  <div className="mt-1 flex flex-wrap gap-2">
                    <motion.button whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black text-white font-semibold"
                      onClick={()=>save("add")}>
                      <Plus size={16}/> Add
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50 font-semibold"
                      onClick={()=>save("update")}>
                      <Pencil size={16}/> Update
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border hover:bg-gray-50 font-semibold"
                      onClick={()=>save("delete")}>
                      <Trash2 size={16}/> Delete
                    </motion.button>
                  </div>

                  <div className="text-xs text-gray-500">
                    Delete/Update ku <b>id</b> correct-a irukanum ✅
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border p-7">
                <div className="font-semibold text-lg">Active Offers</div>
                <div className="mt-4 space-y-3">
                  {offers.length === 0 ? (
                    <div className="text-sm text-gray-600">{loading ? "Loading..." : "No offers"}</div>
                  ) : (
                    offers.map((o) => (
                      <button
                        key={o.id}
                        className="w-full text-left rounded-3xl border p-5 hover:bg-gray-50"
                        onClick={() => setForm({ ...o })}
                      >
                        <div className="font-semibold">{o.title}</div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">{o.description}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          ID: {o.id} {o.price ? `• ₹${o.price}` : ""} {o.validTill ? `• till ${o.validTill}` : ""}
                        </div>
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
