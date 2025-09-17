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

export interface MeetingAttendee {
  name: string;
  email: string;
}

export interface IntakeData {
  // Contact & meeting
  fullName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  attendees: MeetingAttendee[];

  // Academics
  gpa?: number;
  numCollegeClasses?: number;
  credits?: number; // total earned college credits
  dualEnrollment?: "Yes" | "No";
  actScore?: number;
  satScore?: number;
  desiredMajor?: string;
  hsGradMonthYear?: string; // YYYY-MM

  // Soccer
  desiredLevel?: Level;
  academicallyEligible?: "Yes" | "No" | "Unsure";
  ncaaEligibilityNumber?: string;
  collegeOffers?: string;

  // Residency & Financials
  residency?: Residency;
  planToUseFAFSA?: "Yes" | "No";
  downPayment?: number;
  workHoursPerWeek?: number;
  semesters?: 2 | 3;

  // Logistics
  visitDate?: string;
  startDate?: string;

  // College selection
  desiredSchools: string[]; // College IDs
}

interface Store {
  data: IntakeData;
  colleges: College[];
  setData: (patch: Partial<IntakeData>) => void;
  addAttendee: () => void;
  updateAttendee: (index: number, patch: Partial<MeetingAttendee>) => void;
  removeAttendee: (index: number) => void;
  loadColleges: (list: College[]) => void;
  reset: () => void;
}

export const BASE_FEE = 31750;

export const useStore = create<Store>((set) => ({
  data: { desiredSchools: [], semesters: 2, attendees: [], planToUseFAFSA: "Yes" },
  colleges: [],
  setData: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  addAttendee: () => set((s) => ({ data: { ...s.data, attendees: [...(s.data.attendees ?? []), { name: "", email: "" }] } })),
  updateAttendee: (index, patch) => set((s) => {
    const arr = [...(s.data.attendees ?? [])];
    if (arr[index]) arr[index] = { ...arr[index], ...patch };
    return { data: { ...s.data, attendees: arr } };
  }),
  removeAttendee: (index) => set((s) => {
    const arr = [...(s.data.attendees ?? [])];
    arr.splice(index, 1);
    return { data: { ...s.data, attendees: arr } };
  }),
  loadColleges: (list) => set(() => ({ colleges: list })),
  reset: () => set({ data: { desiredSchools: [], semesters: 2, attendees: [], planToUseFAFSA: "Yes" } }),
}));

// --- Helpers ---
export function isFAFSAEligible(residency?: Residency) {
  return residency === "Citizen" || residency === "Permanent Resident";
}

// UPDATED: 11 credits = GAP year available (clock not started); 12+ = Redshirt (clock started)
export function eligibilityStatus(credits?: number) {
  if (credits == null) return { status: "Unknown", clockStarted: false, yearsRemaining: 5, gapYear: true, redshirtUsed: false, thresholdNote: "≤11 credits: Gap year; ≥12: Redshirt/clock started" };
  if (credits >= 12) {
    return { status: "Clock started (≥12 credits)", clockStarted: true, yearsRemaining: 5, gapYear: false, redshirtUsed: true, thresholdNote: "≥12 credits → redshirt/clock started" };
  }
  return { status: "Clock not started (≤11 credits)", clockStarted: false, yearsRemaining: 5, gapYear: true, redshirtUsed: false, thresholdNote: "≤11 credits → gap year available" };
}

export function computeFinancials({
  downPayment = 0,
  residency,
  workHoursPerWeek = 0,
  hourlyRate = 15,
  weeks = 32,
  semesters = 2,
  planToUseFAFSA = "Yes"
}: {
  downPayment?: number;
  residency?: Residency;
  workHoursPerWeek?: number;
  hourlyRate?: number;
  weeks?: number;
  semesters?: 2 | 3;
  planToUseFAFSA?: "Yes" | "No";
}) {
  const base = BASE_FEE;
  const fafsaEligible = isFAFSAEligible(residency);
  const willUseFAFSA = fafsaEligible && planToUseFAFSA === "Yes";
  // Placeholder FAFSA estimate logic
  const fafsaEstimate = willUseFAFSA ? 5000 : 0;
  const workOffset = workHoursPerWeek * hourlyRate * weeks;
  const totalOffset = downPayment + fafsaEstimate + workOffset;
  const remaining = Math.max(0, base - totalOffset);
  return { base, fafsaEligible, willUseFAFSA, fafsaEstimate, workOffset, totalOffset, remaining, semesters };
}
