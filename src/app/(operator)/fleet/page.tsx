"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import {
  VEHICLE_TYPES,
  VEHICLE_BASE_RATE,
  fleetBasePremium,
  formatCurrency,
  computePremium,
  totalOdometer,
  type VehicleType,
} from "@/lib/data/operators";

type Errors = Partial<Record<"rego" | "make" | "year" | "odo", string>>;

const THIS_YEAR = new Date().getFullYear();

export default function FleetPage() {
  const { current, addVehicle, removeVehicle } = useStore();
  const [open, setOpen] = useState(false);

  const [rego, setRego] = useState("");
  const [type, setType] = useState<VehicleType>("Prime mover");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("2022");
  const [odo, setOdo] = useState("50000");
  const [errors, setErrors] = useState<Errors>({});

  if (!current) return null;

  const premium = computePremium(current);
  const base = fleetBasePremium(current.vehicles);
  const odoTotal = totalOdometer(current.vehicles);

  function reset() {
    setRego("");
    setType("Prime mover");
    setMake("");
    setYear("2022");
    setOdo("50000");
    setErrors({});
  }

  function validate(): Errors {
    const next: Errors = {};
    const trimmed = rego.trim();
    if (!trimmed) {
      next.rego = "Enter the registration.";
    } else if (
      current!.vehicles.some(
        (v) => v.rego.toUpperCase() === trimmed.toUpperCase(),
      )
    ) {
      next.rego = `${trimmed.toUpperCase()} is already on this policy.`;
    }
    if (!make.trim()) next.make = "Enter the make and model.";

    const y = Number(year);
    if (!year.trim() || Number.isNaN(y)) {
      next.year = "Enter a year.";
    } else if (y < 1970 || y > THIS_YEAR + 1) {
      next.year = `Use a year between 1970 and ${THIS_YEAR + 1}.`;
    }

    const km = Number(odo);
    if (!odo.trim() || Number.isNaN(km) || km < 0) {
      next.odo = "Enter the odometer reading in kilometres.";
    }
    return next;
  }

  function save() {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addVehicle({
      rego: rego.trim().toUpperCase(),
      type,
      make: make.trim(),
      year: Number(year),
      odometerKm: Number(odo),
      status: "active",
    });
    reset();
    setOpen(false);
  }

  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-6 py-12">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 border-b border-rule pb-8 md:flex-row md:items-end">
          <div>
            <p className="field-label">Covered vehicles</p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.02]">
              Fleet
            </h1>
            <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
              Everything on this schedule is covered and priced. Adding or
              retiring a vehicle re-prices the policy straight away — the
              current figure is {formatCurrency(premium)} a year.
            </p>
          </div>
          <Button className="shrink-0" onClick={() => setOpen(true)}>
            Add a vehicle
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        {current.vehicles.length === 0 ? (
          <EmptyState
            title="Nothing on the schedule"
            body="A policy with no vehicles on it can't be priced. Add the first one and the premium calculation starts from there."
            action={<Button onClick={() => setOpen(true)}>Add a vehicle</Button>}
          />
        ) : (
          <div className="border border-rule bg-paper-raised">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rego</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make &amp; model</TableHead>
                  <TableHead className="text-right">Year</TableHead>
                  <TableHead className="text-right">Odometer</TableHead>
                  <TableHead className="text-right">Base rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Remove</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {v.rego}
                    </TableCell>
                    <TableCell className="text-ink-muted">{v.type}</TableCell>
                    <TableCell>{v.make}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-ink-muted">
                      {v.year}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-ink-muted">
                      {v.odometerKm.toLocaleString("en-AU")} km
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatCurrency(VEHICLE_BASE_RATE[v.type])}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 text-xs">
                        <span
                          className={`size-2 shrink-0 ${
                            v.status === "active" ? "bg-tier-1" : "bg-tier-2"
                          }`}
                          aria-hidden
                        />
                        <span
                          className={
                            v.status === "active"
                              ? "text-tier-1-ink"
                              : "text-tier-2-ink"
                          }
                        >
                          {v.status === "active" ? "Active" : "In workshop"}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => removeVehicle(v.id)}
                        className="rounded-[2px] px-2 py-1 text-xs text-ink-muted transition-colors duration-200 ease-docket hover:bg-tier-3-wash hover:text-tier-3-ink"
                      >
                        Remove
                        <span className="sr-only"> {v.rego} from the policy</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="field-label">Total</TableCell>
                  <TableCell className="text-xs text-ink-muted">
                    {current.vehicles.length} vehicles
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right font-mono text-xs">
                    {odoTotal.toLocaleString("en-AU")} km
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-medium">
                    {formatCurrency(base)}
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </Reveal>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Base rate is the filed annual rate for the vehicle class before the
        audit adjustment and distance loading are applied.
      </p>

      {/* ---------- Add vehicle ---------- */}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a vehicle</DialogTitle>
            <DialogDescription>
              It joins the covered schedule immediately and the annual premium
              is recalculated on save.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rego">Registration</Label>
                <Input
                  id="rego"
                  value={rego}
                  onChange={(e) => {
                    setRego(e.target.value);
                    setErrors((x) => ({ ...x, rego: undefined }));
                  }}
                  placeholder="HAL-04"
                  aria-invalid={!!errors.rego}
                  aria-describedby={errors.rego ? "rego-error" : undefined}
                />
                <FieldError id="rego-error">{errors.rego}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setErrors((x) => ({ ...x, year: undefined }));
                  }}
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? "year-error" : undefined}
                />
                <FieldError id="year-error">{errors.year}</FieldError>
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-[13px] font-medium">Vehicle class</legend>
              <div className="grid grid-cols-2 gap-px border border-rule bg-rule">
                {VEHICLE_TYPES.map((t) => {
                  const active = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setType(t)}
                      className={`flex flex-col gap-0.5 p-3 text-left transition-colors duration-200 ease-docket ${
                        active
                          ? "bg-accent-wash text-ink"
                          : "bg-paper-raised text-ink-muted hover:bg-paper-sunk"
                      }`}
                    >
                      <span className="text-[13px] font-medium text-ink">
                        {t}
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        {formatCurrency(VEHICLE_BASE_RATE[t])}/yr
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make &amp; model</Label>
                <Input
                  id="make"
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    setErrors((x) => ({ ...x, make: undefined }));
                  }}
                  placeholder="Kenworth T610"
                  aria-invalid={!!errors.make}
                  aria-describedby={errors.make ? "make-error" : undefined}
                />
                <FieldError id="make-error">{errors.make}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odo">Odometer (km)</Label>
                <Input
                  id="odo"
                  type="number"
                  value={odo}
                  onChange={(e) => {
                    setOdo(e.target.value);
                    setErrors((x) => ({ ...x, odo: undefined }));
                  }}
                  aria-invalid={!!errors.odo}
                  aria-describedby={errors.odo ? "odo-error" : undefined}
                />
                <FieldError id="odo-error">{errors.odo}</FieldError>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Add to schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
