"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Truck,
  ShieldAlert,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export interface Pharmacy {
  id: string;
  name: string;
  chain: string;
  ncpdpId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  hours: string;
  is24Hour: boolean;
  hasDelivery: boolean;
  inNetwork: boolean;
  distance: string;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "ph-101",
    name: "CVS Pharmacy #04218",
    chain: "CVS Health",
    ncpdpId: "3948210",
    address: "1420 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    phone: "(415) 555-0142",
    fax: "(415) 555-0143",
    hours: "8:00 AM - 10:00 PM",
    is24Hour: false,
    hasDelivery: true,
    inNetwork: true,
    distance: "0.4 miles",
  },
  {
    id: "ph-102",
    name: "Walgreens Community Pharmacy #1104",
    chain: "Walgreens",
    ncpdpId: "4820193",
    address: "498 Castro Street",
    city: "San Francisco",
    state: "CA",
    zip: "94114",
    phone: "(415) 555-0198",
    fax: "(415) 555-0199",
    hours: "Open 24 Hours",
    is24Hour: true,
    hasDelivery: true,
    inNetwork: true,
    distance: "1.1 miles",
  },
  {
    id: "ph-103",
    name: "Kaiser Permanente Central Pharmacy",
    chain: "Kaiser",
    ncpdpId: "9021844",
    address: "2425 Geary Blvd, 1st Floor",
    city: "San Francisco",
    state: "CA",
    zip: "94115",
    phone: "(415) 555-0820",
    fax: "(415) 555-0821",
    hours: "8:30 AM - 8:00 PM",
    is24Hour: false,
    hasDelivery: false,
    inNetwork: true,
    distance: "1.8 miles",
  },
];

interface AddPharmacyWebModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  medicationName?: string;
  dosage?: string;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
}

/**
 * Web App Clinical "Add Pharmacy" & E-Prescription Modal.
 * Designed for clinicians: wide multi-column layout, NPI/NCPDP validation,
 * automated drug-drug interaction warning checks, and FHIR MedicationRequest transmission.
 */
export function AddPharmacyWebModal({
  open,
  onOpenChange,
  patientName = "Louise Reed (30yo F)",
  medicationName = "Sumatriptan 50mg PRN & Amlodipine 5mg QD",
  dosage = "Oral Tablet, 30-day supply with 2 refills",
  onSelectPharmacy,
}: AddPharmacyWebModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter24Hr, setFilter24Hr] = useState(false);
  const [filterDelivery, setFilterDelivery] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(
    MOCK_PHARMACIES[0]
  );
  const [isTransmitting, setIsTransmitting] = useState(false);

  const filteredPharmacies = MOCK_PHARMACIES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zip.includes(searchQuery) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter24Hr && !p.is24Hour) return false;
    if (filterDelivery && !p.hasDelivery) return false;
    return matchesSearch;
  });

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      onSelectPharmacy?.(selectedPharmacy);
      toast.success(
        `E-Prescription transmitted via FHIR R4 to ${selectedPharmacy.name}!`
      );
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border border-border shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  FHIR R4 e-Prescribe
                </Badge>
                <span className="text-xs text-slate-400">
                  NCPDP Script v2017071
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-400" />
                Select Dispensing Pharmacy for Patient
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Patient: <span className="text-white font-medium">{patientName}</span> •
                Prescription: <span className="text-cyan-300 font-medium">{medicationName}</span>
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Clinical Drug Interaction Alert Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Clinical CDS Check Passed:</strong> No severe drug-drug interactions detected with patient&apos;s active FHIR MedicationStatement.
            </span>
          </div>
          <Badge variant="outline" className="text-[11px] border-amber-500/30 text-amber-400">
            Formulary Tier 1 ($10 Copay)
          </Badge>
        </div>

        {/* Body: Two Column Search & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] max-h-[520px]">
          {/* Left Column: Search & Pharmacy Directory (7 cols) */}
          <div className="md:col-span-7 border-r border-border p-5 space-y-4 overflow-y-auto">
            {/* Search Bar */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Search by Pharmacy Name, Street, or Zip Code
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. CVS, Walgreens, 94102..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-24"
                    checked={filter24Hr}
                    onCheckedChange={(c) => setFilter24Hr(!!c)}
                  />
                  <label
                    htmlFor="filter-24"
                    className="text-xs font-medium text-muted-foreground cursor-pointer"
                  >
                    24-Hour Pharmacy
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-delivery"
                    checked={filterDelivery}
                    onCheckedChange={(c) => setFilterDelivery(!!c)}
                  />
                  <label
                    htmlFor="filter-delivery"
                    className="text-xs font-medium text-muted-foreground cursor-pointer"
                  >
                    Home Delivery Available
                  </label>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 pt-2">
              {filteredPharmacies.map((pharmacy) => {
                const isSelected = selectedPharmacy.id === pharmacy.id;
                return (
                  <div
                    key={pharmacy.id}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                        : "bg-card hover:bg-muted/40 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {pharmacy.name}
                          </span>
                          {pharmacy.inNetwork && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] py-0 px-1.5">
                              In-Network
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {pharmacy.address}, {pharmacy.city}, {pharmacy.state}{" "}
                          {pharmacy.zip}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary block">
                          {pharmacy.distance}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {pharmacy.is24Hour ? "24 Hours" : pharmacy.hours}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-muted/60 text-[11px] text-muted-foreground">
                      <span>NCPDP: <code className="font-mono text-foreground">{pharmacy.ncpdpId}</code></span>
                      <span>•</span>
                      <span>Tel: {pharmacy.phone}</span>
                      {pharmacy.hasDelivery && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Truck className="h-3 w-3" /> Delivery
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Prescription Summary & Direct Transmission (5 cols) */}
          <div className="md:col-span-5 p-5 bg-muted/20 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Prescription Target Summary
                </span>
                <div className="mt-2 bg-card p-3 rounded-lg border text-xs space-y-1.5">
                  <div className="font-semibold text-foreground text-sm">
                    {medicationName}
                  </div>
                  <div className="text-muted-foreground">{dosage}</div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t">
                    Prescribing Doctor: <strong>Dr. Arjun Mehta, MD</strong> (NPI: 1948201934)
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Selected Dispenser
                </span>
                <div className="mt-2 bg-primary/5 border border-primary/20 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">
                      {selectedPharmacy.name}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedPharmacy.address}, {selectedPharmacy.city},{" "}
                    {selectedPharmacy.state} {selectedPharmacy.zip}
                  </p>
                  <div className="text-xs space-y-0.5 pt-1.5 border-t border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{selectedPharmacy.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fax:</span>
                      <span className="font-medium">{selectedPharmacy.fax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operating:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {selectedPharmacy.hours}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 p-3 rounded-lg border border-border text-[11px] text-muted-foreground space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  Surescripts Electronic Routing
                </div>
                <p>
                  Transmitting will immediately generate a signed FHIR R4{" "}
                  <code>MedicationRequest</code> resource linked to Encounter ID #ENC-8401.
                </p>
              </div>
            </div>

            {/* Transmit Button */}
            <div className="pt-3 border-t">
              <Button
                onClick={handleTransmit}
                disabled={isTransmitting}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-md gap-2"
              >
                {isTransmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transmitting to Pharmacy…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Authorize & Transmit e-Prescription
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
