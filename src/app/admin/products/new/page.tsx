"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewProductPage() {
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const addSpec = () => setSpecs(s => [...s, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(s => s.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) =>
    setSpecs(s => s.map((sp, idx) => idx === i ? { ...sp, [field]: val } : sp));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="white" size="icon"><ArrowLeft size={15} /></Button>
        </Link>
        <div>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-0.5">Catalogue</p>
          <h1 className="text-2xl font-display font-bold text-gray-900">New Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Product Details</p>
            <Input label="Product Name" placeholder="e.g. iPhone 16 Pro Max" />
            <Input label="Slug" placeholder="e.g. iphone-16-pro-max" />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                placeholder="Describe the product..."
              />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Pricing & Stock</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (KES)" placeholder="0" type="number" />
              <Input label="Compare Price (KES)" placeholder="0" type="number" />
            </div>
            <Input label="Stock Quantity" placeholder="0" type="number" />
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <p className="text-sm font-semibold text-gray-900">Specifications</p>
              <Button variant="ghost" size="sm" onClick={addSpec} className="text-xs">
                <Plus size={12} /> Add Row
              </Button>
            </div>
            <div className="space-y-2">
              {specs.map((sp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="e.g. RAM" value={sp.key} onChange={e => updateSpec(i, "key", e.target.value)} />
                  <Input placeholder="e.g. 8GB" value={sp.value} onChange={e => updateSpec(i, "value", e.target.value)} />
                  <button onClick={() => removeSpec(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Organisation</p>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Category</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {["Phones", "Laptops", "Accessories"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Input label="Brand" placeholder="e.g. Apple" />
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Image</p>
            <div className="border-2 border-dashed border-indigo-100 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
              <Upload size={20} className="text-indigo-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
            <Input label="Or paste image URL" placeholder="https://..." />
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Visibility</p>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-700">Active</p>
                <p className="text-xs text-gray-400">Visible in store</p>
              </div>
              <button
                onClick={() => setActive(a => !a)}
                className={`w-11 h-6 rounded-full transition-all ${active ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-1 ${active ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-700">Featured</p>
                <p className="text-xs text-gray-400">Show on homepage</p>
              </div>
              <button
                onClick={() => setFeatured(f => !f)}
                className={`w-11 h-6 rounded-full transition-all ${featured ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-1 ${featured ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </label>
          </Card>

          <div className="flex gap-2">
            <Button className="flex-1">Save Product</Button>
            <Link href="/admin/products" className="flex-1">
              <Button variant="white" className="w-full">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
