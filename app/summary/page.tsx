"use client";
import { useMemo } from "react";
import { useStore, eligibilityStatus, computeFinancials } from "@/lib/store";

function formatDate(d?: string) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}

export default function SummaryPage() {
  const { data, colleges } = useStore();
  const elig = eligibilityStatus(data.credits);
  const fin = computeFinancials({
    downPayment: data.downPayment ?? 0,
    residency: data.residency,
    workHoursPerWeek: data.workHoursPerWeek ?? 0,
    semesters: data.semesters ?? 2,
  });

  const selectedColleges = useMemo(() => {
    const ids = new Set(data.desiredSchools);
    return colleges.filter(c => ids.has(c.id));
  }, [data.desiredSchools, colleges]);

  const now = new Date().toISOString();

  return (
    <div className="container-narrow space-y-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Personalized PCDA Pathway</h1>
          <div className="text-xs text-slate-500">Generated: {new Date(now).toLocaleString()}</div>
        </div>
      </div>

      <section className="grid-2">
        <div className="card space-y-2">
          <div className="font-semibold">Academic Snapshot</div>
          <div className="text-sm">GPA: <span className="badge">{data.gpa ?? "—"}</span></div>
          <div className="text-sm">College classes: <span className="badge">{data.numCollegeClasses ?? "—"}</span></div>
          <div className="text-sm">Credits taken: <span className="badge">{data.credits ?? "—"}</span></div>
          <div className="text-sm">Academic eligibility for targets: <span className="badge">{data.academicallyEligible ?? "Unsure"}</span></div>
        </div>
        <div className="card space-y-2">
          <div className="font-semibold">Eligibility Overview</div>
          <div className="text-sm">Status: <span className="badge">{elig.status}</span></div>
          <div className="text-sm">Years remaining: <span className="badge">{elig.yearsRemaining}</span></div>
          <div className="text-sm">Gap year: <span className="badge">{elig.gapYear ? "Available" : "No"}</span></div>
          <div className="text-sm">Redshirt used: <span className="badge">{elig.redshirtUsed ? "Yes" : "No"}</span></div>
        </div>
      </section>

      <section className="card space-y-3">
        <div className="font-semibold">Financial Roadmap</div>
        <div className="grid-3">
          <div>
            <div className="text-sm text-slate-500">Base Fee</div>
            <div className="text-2xl font-bold">${fin.base.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Down Payment</div>
            <div className="text-2xl font-bold">${(data.downPayment ?? 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">FAFSA Estimate</div>
            <div className="text-2xl font-bold">${fin.fafsaEstimate.toLocaleString()}</div>
          </div>
        </div>
        <div className="grid-3">
          <div>
            <div className="text-sm text-slate-500">Work Hours/Week</div>
            <div className="text-2xl font-bold">{data.workHoursPerWeek ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Semesters</div>
            <div className="text-2xl font-bold">{data.semesters ?? 2}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Remaining</div>
            <div className="text-3xl font-extrabold">${fin.remaining.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section className="card space-y-2">
        <div className="font-semibold">College Targets ({selectedColleges.length})</div>
        <ul className="space-y-2">
          {selectedColleges.map(c => (
            <li key={c.id} className="border rounded-xl p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-slate-600">{c.location} • {c.governingBody}{c.division?` ${c.division}`:""} • COA ${c.estimatedCOA.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Avg class size: {c.avgClassSize ?? "—"}</div>
              <div className="text-xs text-slate-500">
                Records: {c.records.map(r => `${r.season} ${r.wins}-${r.losses}-${r.draws}`).join(" • ")}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3">
        <div className="font-semibold">Action Timeline</div>
        <div className="grid-2">
          <div className="border rounded-xl p-4">
            <div className="text-sm text-slate-500">Commit to PCDA</div>
            <div className="font-semibold">Program Start: {formatDate(data.startDate)}</div>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
              <li>Submit enrollment agreement</li>
              <li>Finalize down payment</li>
              <li>Set up work-study placement (if applicable)</li>
            </ul>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-sm text-slate-500">Visit & FAFSA</div>
            <div className="font-semibold">Visit Date: {formatDate(data.visitDate)}</div>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
              <li>Complete FAFSA (if eligible)</li>
              <li>Order transcripts & test scores</li>
              <li>Record highlight reel and send to target coaches</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
