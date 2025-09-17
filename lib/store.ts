import { create } from "zustand";

export type Residency = "Citizen" | "Permanent Resident" | "Other";
export type Level = "NCAA D1" | "NCAA D2" | "NCAA D3" | "NAIA" | "Undecided";

export interface College {
  id: string;
  name: string;
  type: "Public" | "Private";
  governingBody: "NCAA" | "NAIA";
  division?: "D1" | "D2" | "D3";
  location: string;
  estimatedCOA: number;
  avgClassSize?: number;
  records: { season: string; wins: number; losses: number; draws: number }[];
}

export interface IntakeData {
  gpa?: number;
  numCollegeClasses?: number;
  credits?: number;
  desiredLevel?: Level;
  academicallyEligible?: "Yes" | "No" | "Unsure";
  residency?: Residency;
  desiredSchools: string[]; // College IDs
  downPayment?: number;
  workHoursPerWeek?: number;
  semesters?: 2 | 3;
  visitDate?: string;
  startDate?: string;
}

interface Store {
  data: IntakeData;
  colleges: College[];
  setData: (patch: Partial<IntakeData>) => void;
  loadColleges: (list: College[]) => void;
  reset: () => void;
}

export const BASE_FEE = 31750;

export const useStore = create<Store>((set) => ({
  data: { desiredSchools: [], semesters: 2 },
  colleges: [],
  setData: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  loadColleges: (list) => set(() => ({ colleges: list })),
  reset: () => set({ data: { desiredSchools: [], semesters: 2 } }),
}));

// --- Helpers ---
export function isFAFSAEligible(residency?: Residency) {
  return residency === "Citizen" || residency === "Permanent Resident";
}

export function eligibilityStatus(credits?: number) {
  if (credits == null) return { status: "Unknown", clockStarted: false, yearsRemaining: 5, gapYear: true, redshirtUsed: false };
  if (credits >= 24) {
    // Clock started; Gap becomes redshirt route.
    return { status: "Clock started (≥24 credits)", clockStarted: true, yearsRemaining: 5, gapYear: false, redshirtUsed: true };
  }
  // Under 24: gap year available, clock not started
  return { status: "Clock not started (<24 credits)", clockStarted: false, yearsRemaining: 5, gapYear: true, redshirtUsed: false };
}

export function computeFinancials({
  downPayment = 0,
  residency,
  workHoursPerWeek = 0,
  hourlyRate = 15,
  weeks = 32,
  semesters = 2
}: {
  downPayment?: number;
  residency?: Residency;
  workHoursPerWeek?: number;
  hourlyRate?: number;
  weeks?: number;
  semesters?: 2 | 3;
}) {
  const base = BASE_FEE;
  const fafsaEligible = isFAFSAEligible(residency);
  // Placeholder FAFSA estimate logic: user will enter actual award later; show $0 if not eligible.
  const fafsaEstimate = fafsaEligible ? 5000 : 0; // easily editable in UI
  const workOffset = workHoursPerWeek * hourlyRate * weeks;
  const totalOffset = downPayment + fafsaEstimate + workOffset;
  const remaining = Math.max(0, base - totalOffset);
  return { base, fafsaEligible, fafsaEstimate, workOffset, totalOffset, remaining, semesters };
}
