"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Configuration</p>
        <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
      </div>

      <Card className="p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Store Details</p>
        <Input label="Store Name" defaultValue="VisionTech Electronics" />
        <Input label="Contact Email" defaultValue="hello@visiontech.co.ke" />
        <Input label="Contact Phone" defaultValue="+254 712 345 678" />
        <Input label="Location" defaultValue="Nairobi, Kenya" />
      </Card>

      <Card className="p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">M-Pesa Configuration</p>
        <Input label="Consumer Key" placeholder="••••••••••••••••" type="password" />
        <Input label="Consumer Secret" placeholder="••••••••••••••••" type="password" />
        <Input label="Shortcode" placeholder="174379" />
        <Input label="Passkey" placeholder="••••••••••••••••" type="password" />
      </Card>

      <Card className="p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Admin Account</p>
        <Input label="Display Name" defaultValue="Admin User" />
        <Input label="Email" defaultValue="admin@visiontech.co.ke" />
        <Input label="New Password" type="password" placeholder="Leave blank to keep current" />
      </Card>

      <div className="flex gap-3">
        <Button>Save Changes</Button>
        <Button variant="white">Cancel</Button>
      </div>
    </div>
  );
}
