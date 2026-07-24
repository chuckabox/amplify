"use client";

import { useState } from "react";
import { Plus, Trash2, Wrench, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/operator-store";
import {
  VEHICLE_TYPES,
  VEHICLE_BASE_RATE,
  formatCurrency,
  computePremium,
  type VehicleType,
} from "@/lib/data/operators";

export default function FleetPage() {
  const { current, addVehicle, removeVehicle } = useStore();
  const [open, setOpen] = useState(false);

  const [rego, setRego] = useState("");
  const [type, setType] = useState<VehicleType>("Prime mover");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("2022");
  const [odo, setOdo] = useState("50000");

  if (!current) return null;

  const premium = computePremium(current);
  const canSave = rego.trim() && make.trim();

  function reset() {
    setRego("");
    setType("Prime mover");
    setMake("");
    setYear("2022");
    setOdo("50000");
  }

  function save() {
    if (!canSave) return;
    addVehicle({
      rego: rego.trim().toUpperCase(),
      type,
      make: make.trim(),
      year: Number(year) || new Date().getFullYear(),
      odometerKm: Number(odo) || 0,
      status: "active",
    });
    reset();
    setOpen(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fleet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {current.vehicles.length} vehicles · adding or removing a vehicle
            re-prices your premium ({formatCurrency(premium)}/yr).
          </p>
        </div>

        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add vehicle
        </Button>

        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) reset();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a vehicle</DialogTitle>
              <DialogDescription>
                Adds to your covered fleet and updates your annual premium.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rego">Registration</Label>
                  <Input
                    id="rego"
                    value={rego}
                    onChange={(e) => setRego(e.target.value)}
                    placeholder="ABC-123"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Vehicle type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {VEHICLE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        type === t
                          ? "border-primary bg-accent text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <span className="block font-medium">{t}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatCurrency(VEHICLE_BASE_RATE[t])}/yr base
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="make">Make & model</Label>
                  <Input
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="Kenworth T610"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="odo">Odometer (km)</Label>
                  <Input
                    id="odo"
                    type="number"
                    value={odo}
                    onChange={(e) => setOdo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!canSave}>
                Add to fleet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fleet table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Rego", "Type", "Make & model", "Year", "Odometer", "Base rate", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.vehicles.map((v) => (
                <tr key={v.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-foreground">
                    {v.rego}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{v.type}</td>
                  <td className="px-5 py-3 text-foreground">{v.make}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.year}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {v.odometerKm.toLocaleString()} km
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatCurrency(VEHICLE_BASE_RATE[v.type])}
                  </td>
                  <td className="px-5 py-3">
                    {v.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CircleDot className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <Wrench className="h-3.5 w-3.5" />
                        Maintenance
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => removeVehicle(v.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="Remove vehicle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
