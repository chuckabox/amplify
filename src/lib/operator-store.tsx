"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  INITIAL_OPERATORS,
  type Audit,
  type Operator,
  type Vehicle,
} from "@/lib/data/operators";

const STORAGE_KEY = "tonnage:v1";

interface Persisted {
  operators: Operator[];
  currentId: string | null;
}

interface StoreValue {
  ready: boolean;
  operators: Operator[];
  current: Operator | null;
  login: (id: string) => void;
  logout: () => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  removeVehicle: (vehicleId: string) => void;
  completeAudit: (audit: Audit) => void;
  signOffAudit: (
    operatorId: string,
    auditId: string,
    opts?: { decision?: "agreed" | "noted"; notes?: string },
  ) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") {
    return { operators: INITIAL_OPERATORS, currentId: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return { operators: INITIAL_OPERATORS, currentId: null };
}

export function OperatorProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const data = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOperators(data.operators);
    setCurrentId(data.currentId);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ operators, currentId }),
    );
  }, [ready, operators, currentId]);

  const login = useCallback((id: string) => setCurrentId(id), []);
  const logout = useCallback(() => setCurrentId(null), []);

  const mutateCurrent = useCallback(
    (fn: (op: Operator) => Operator) => {
      setOperators((prev) =>
        prev.map((op) => (op.id === currentId ? fn(op) : op)),
      );
    },
    [currentId],
  );

  const addVehicle = useCallback(
    (vehicle: Omit<Vehicle, "id">) => {
      mutateCurrent((op) => ({
        ...op,
        vehicles: [
          ...op.vehicles,
          { ...vehicle, id: `v-${Date.now()}` },
        ],
      }));
    },
    [mutateCurrent],
  );

  const removeVehicle = useCallback(
    (vehicleId: string) => {
      mutateCurrent((op) => ({
        ...op,
        vehicles: op.vehicles.filter((v) => v.id !== vehicleId),
      }));
    },
    [mutateCurrent],
  );

  const completeAudit = useCallback(
    (audit: Audit) => {
      mutateCurrent((op) => ({ ...op, audits: [audit, ...op.audits] }));
    },
    [mutateCurrent],
  );

  const signOffAudit = useCallback(
    (
      operatorId: string,
      auditId: string,
      opts?: { decision?: "agreed" | "noted"; notes?: string },
    ) => {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === operatorId
            ? {
                ...op,
                audits: op.audits.map((a) =>
                  a.id === auditId
                    ? {
                        ...a,
                        status: "signed",
                        engineerDecision: opts?.decision ?? "agreed",
                        engineerNotes: opts?.notes,
                      }
                    : a,
                ),
              }
            : op,
        ),
      );
    },
    [],
  );

  const reset = useCallback(() => {
    setOperators(INITIAL_OPERATORS);
    setCurrentId(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const current = useMemo(
    () => operators.find((op) => op.id === currentId) ?? null,
    [operators, currentId],
  );

  const value: StoreValue = {
    ready,
    operators,
    current,
    login,
    logout,
    addVehicle,
    removeVehicle,
    completeAudit,
    signOffAudit,
    reset,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within OperatorProvider");
  return ctx;
}
