"use client";

import React, { useState } from "react";
import {
  Pill,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  TrendingDown,
  Truck,
  CreditCard,
  QrCode,
  FileCheck2,
  AlertCircle,
  Clock,
  Heart,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CartItem {
  id: string;
  prescribedBrand: string;
  genericName: string;
  dosage: string;
  brandedPrice: number;
  genericPrice: number;
  quantity: number;
  isGenericSelected: boolean;
  category: "prescription" | "supplement";
}

const INITIAL_CART: CartItem[] = [
  {
    id: "med-1",
    prescribedBrand: "Norvasc 5mg",
    genericName: "Amlodipine 5mg Tablet",
    dosage: "1 Tab PO OD (Night) • 30 Days",
    brandedPrice: 120,
    genericPrice: 28,
    quantity: 1,
    isGenericSelected: true,
    category: "prescription",
  },
  {
    id: "med-2",
    prescribedBrand: "Telma 40mg",
    genericName: "Telmisartan 40mg Tablet",
    dosage: "1 Tab PO OD (Morning) • 30 Days",
    brandedPrice: 185,
    genericPrice: 42,
    quantity: 1,
    isGenericSelected: true,
    category: "prescription",
  },
  {
    id: "med-3",
    prescribedBrand: "Dolo 650mg",
    genericName: "Paracetamol 650mg Tablet",
    dosage: "1 Tab SOS for Headache • Max 3/Day",
    brandedPrice: 34,
    genericPrice: 14,
    quantity: 1,
    isGenericSelected: true,
    category: "prescription",
  },
];

const WELLNESS_SUPPLEMENTS = [
  {
    id: "supp-1",
    name: "Vitamin D3 60,000 IU Nano-Shots",
    description: "Weekly high-potency cholecalciferol for bone & immunity",
    genericPrice: 199,
    mrp: 320,
    tag: "Immunity",
  },
  {
    id: "supp-2",
    name: "Omega-3 Triple Strength Fish Oil",
    description: "1000mg EPA/DHA for cardiovascular & lipid support",
    genericPrice: 449,
    mrp: 850,
    tag: "Heart Health",
  },
  {
    id: "supp-3",
    name: "Magnesium Glycinate 400mg",
    description: "Calming muscle & sleep support for migraine relief",
    genericPrice: 380,
    mrp: 620,
    tag: "Migraine Relief",
  },
  {
    id: "supp-4",
    name: "Electrolyte Hydration Sachet Pack",
    description: "WHO-standard oral rehydration salts for orthostatic dizziness",
    genericPrice: 120,
    mrp: 210,
    tag: "Hydration",
  },
];

export function GenericPharmacyCheckout() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("express");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const toggleGeneric = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isGenericSelected: !item.isGenericSelected } : item
      )
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addSupplement = (supp: (typeof WELLNESS_SUPPLEMENTS)[0]) => {
    if (cart.some((item) => item.id === supp.id)) {
      toast.info(`${supp.name} already in cart!`);
      return;
    }
    const newItem: CartItem = {
      id: supp.id,
      prescribedBrand: supp.name,
      genericName: supp.name,
      dosage: "Daily Wellness Supplement",
      brandedPrice: supp.mrp,
      genericPrice: supp.genericPrice,
      quantity: 1,
      isGenericSelected: true,
      category: "supplement",
    };
    setCart((prev) => [...prev, newItem]);
    toast.success(`Added ${supp.name} to pharmacy cart!`);
  };

  // Cost calculations
  const totalBrandedCost = cart.reduce(
    (sum, item) => sum + item.brandedPrice * item.quantity,
    0
  );
  const actualCartTotal = cart.reduce(
    (sum, item) =>
      sum + (item.isGenericSelected ? item.genericPrice : item.brandedPrice) * item.quantity,
    0
  );
  const totalSavings = totalBrandedCost - actualCartTotal;
  const savingsPercent = totalBrandedCost > 0 ? Math.round((totalSavings / totalBrandedCost) * 100) : 0;
  const deliveryFee = deliverySpeed === "express" ? 49 : 0;
  const grandTotal = actualCartTotal + deliveryFee;

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4 animate-in fade-in duration-300">
        <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <Check className="size-8 stroke-[3]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Order #DG-PHARM-89421 Confirmed!
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your e-prescription has been verified by Apollo Pharmacy Partner. Generic bio-equivalents
          packaged under CDSCO quality standards. Delivery expected within 4 hours.
        </p>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium inline-block">
          🎉 Total Savings Realized on this Order: <strong>₹{totalSavings} ({savingsPercent}% Off)</strong>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Button
            size="sm"
            onClick={() => setOrderPlaced(false)}
            variant="outline"
            className="text-xs"
          >
            Review Prescription Cart
          </Button>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5"
          >
            Track Delivery in Real-Time
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Pill className="size-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              DrGodly Generic Pharmacy & Wellness Store
            </h2>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
              CDSCO Verified Bio-Equivalents
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-linked e-Prescription fulfillment with up to 70% cost reduction on generic alternatives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs py-1 px-2.5 flex items-center gap-1.5">
            <FileCheck2 className="size-3.5 text-teal-600" />
            Rx: <span className="font-mono font-bold">#DG-RX-100328</span>
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs py-1 px-2.5">
            Doctor: <span className="font-semibold text-slate-900">Dr. Arjun Mehta</span>
          </Badge>
        </div>
      </div>

      {/* ── Instant Savings Banner ── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-teal-700 text-white shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white shrink-0">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 block">
              Jan Aushadhi Generic Savings Active
            </span>
            <span className="text-sm font-bold block">
              You are saving ₹{totalSavings} ({savingsPercent}% off standard branded MRP)
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <Badge className="bg-white text-teal-900 font-bold text-xs px-2.5 py-1">
            Same Active Molecule • 100% Bio-Equivalent
          </Badge>
        </div>
      </div>

      {/* ── 2-Column Pharmacy Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: e-Prescription Medicines & Wellness Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Linked Consultation Medicines */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="size-3.5 text-teal-600" />
                  <span>Prescribed Medications (from Visit 27 Oct 2026)</span>
                </CardTitle>
                <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[11px]">
                  Tamper-Evident QR Validated
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {cart
                .filter((item) => item.category === "prescription")
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {item.isGenericSelected ? item.genericName : item.prescribedBrand}
                        </span>
                        {item.isGenericSelected ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                            Generic Bio-Equivalent
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] py-0">
                            Branded Original
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.dosage}</p>

                      {/* Generic vs Branded Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleGeneric(item.id)}
                        className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline decoration-dotted mt-1 block"
                      >
                        {item.isGenericSelected
                          ? `Switch to Branded Original (₹${item.brandedPrice})`
                          : `Switch to Quality Generic (₹${item.genericPrice} - Save ${Math.round(((item.brandedPrice - item.genericPrice) / item.brandedPrice) * 100)}%)`}
                      </button>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 font-mono block">
                          ₹{item.isGenericSelected ? item.genericPrice * item.quantity : item.brandedPrice * item.quantity}
                        </span>
                        {item.isGenericSelected && (
                          <span className="text-[11px] text-slate-400 line-through block font-mono">
                            MRP ₹{item.brandedPrice * item.quantity}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white rounded text-slate-600"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white rounded text-slate-600"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Clinician Recommended Wellness Supplements */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="size-3.5 text-teal-600" />
                  <span>Clinician Recommended Wellness Supplements</span>
                </CardTitle>
                <span className="text-[11px] text-slate-500">Curated for Hypertension & Dizziness</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WELLNESS_SUPPLEMENTS.map((supp) => (
                <div
                  key={supp.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-teal-300 transition-all flex flex-col justify-between space-y-2 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {supp.name}
                      </span>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] py-0 shrink-0">
                        {supp.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {supp.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">
                        ₹{supp.genericPrice}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through font-mono">
                        ₹{supp.mrp}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addSupplement(supp)}
                      className="h-7 text-[11px] px-2 rounded-lg border-teal-200 text-teal-800 hover:bg-teal-50"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary, Delivery & Checkout (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden sticky top-4">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Order Breakdown ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                <span className="text-teal-600 font-mono">Verified e-Rx</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              {/* Delivery Speed Options */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Delivery Speed:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliverySpeed("express")}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      deliverySpeed === "express"
                        ? "bg-teal-50 border-teal-500 text-teal-900 shadow-2xs font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1">
                        <Truck className="size-3 text-teal-600" /> Express
                      </span>
                      <span className="font-mono text-[11px]">₹49</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Within 4 Hours (Apollo)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySpeed("standard")}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      deliverySpeed === "standard"
                        ? "bg-teal-50 border-teal-500 text-teal-900 shadow-2xs font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1">
                        <Clock className="size-3 text-teal-600" /> Standard
                      </span>
                      <span className="font-mono text-[11px] text-emerald-600 font-bold">FREE</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Tomorrow Morning
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Delivery Address (from ABHA Profile):
                </span>
                <p className="text-slate-600 text-[11px]">
                  Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103
                </p>
              </div>

              {/* Price Calculation Matrix */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Standard Branded MRP:</span>
                  <span className="line-through font-mono">₹{totalBrandedCost}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Generic Savings:</span>
                  <span className="font-mono">- ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Generic Medicines Subtotal:</span>
                  <span className="font-mono font-bold">₹{actualCartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges:</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total to Pay:</span>
                  <span className="text-base text-teal-700 font-mono">₹{grandTotal}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block">Payment Method:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "upi", label: "UPI Instant" },
                    { id: "card", label: "Cards / Net" },
                    { id: "cod", label: "Pay on Delivery" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition text-[11px] ${
                        paymentMethod === p.id
                          ? "bg-teal-600 text-white border-teal-600 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                onClick={() => {
                  setOrderPlaced(true);
                  toast.success("Prescription order confirmed with pharmacy partner!");
                }}
                className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs gap-1.5 shadow-md"
              >
                <ShieldCheck className="size-4" />
                <span>Place Order • Pay ₹{grandTotal}</span>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span>100% CDSCO Quality Inspected • Doctor Signed e-Rx</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
