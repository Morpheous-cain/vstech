"use client"

/**
 * Customer Account page — profile info, saved address, password change.
 */
"use client";
import React, { useState } from "react";
import { User, MapPin, Lock, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GoldTopCard } from "@/components/ui/card";

export default function AccountPage() {
  const [profile, setProfile] = useState({ name: "John Kamau", email: "john@example.com", phone: "0712345678", address: "Kilimani, Nairobi" });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Settings</p>
        <h1 className="font-display text-4xl text-foreground">My Account</h1>
      </div>
      <div className="space-y-5">
        <GoldTopCard>
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><User size={16} className="text-gold" /> Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["Full Name", "name"], ["Email", "email"], ["Phone", "phone"]].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs text-obsidian-steel block mb-1">{label}</label>
                <Input value={profile[key as keyof typeof profile]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </GoldTopCard>
        <GoldTopCard>
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><MapPin size={16} className="text-gold" /> Saved Address</h2>
          <Input value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} placeholder="Your delivery address" />
        </GoldTopCard>
        <GoldTopCard>
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Lock size={16} className="text-gold" /> Change Password</h2>
          <div className="space-y-3">
            {["Current Password", "New Password", "Confirm New Password"].map((l) => (
              <div key={l}><label className="text-xs text-obsidian-steel block mb-1">{l}</label><Input type="password" placeholder="••••••••" /></div>
            ))}
          </div>
        </GoldTopCard>
        <button onClick={save} className="btn-gold px-8 py-3">
          <Save size={16} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
