"use client";
import { useEffect, useState } from "react";
import { useStore, isFAFSAEligible, eligibilityStatus, College, computeFinancials } from "@/lib/store";

export default function IntakePage() {
  const { data, setData, loadColleges, colleges } = useStore();
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [weeks, setWeeks] = useState<number>(32);

  useEffect(() => {
    fetch("/colleges.json").then(r => r.json()).then((list: College[]) => {
      loadColleges(list);
    }).catch(() => {
      fetch("/sample-colleges.json").then(r => r.json()).then((list: College[]) => loadColleges(list));
    });
  }, [loadColleges]);

  const elig = eligibilityStatus(data.credits);
  const fin = computeFinancials({
    downPayment: data.downPayment ?? 0,
    residency: data.residency,
    workHoursPerWeek: data.workHoursPerWeek ?? 0,
    hourlyRate, weeks, semesters: data.semesters ?? 2
  });

  return (
    <div className="container-narrow space-y-8">
      <div className="card">
        <h1 className="text-xl font-bold">Live Intake</h1>
        <p className="text-slate-600 text-sm">Fill this in real-time during your video call.</p>
      </div>

      <section className="card space-y-4">
        <h2 className="font-semibold">Academic Info</h2>
        <div className="grid-3">
          <div>
            <label className="label">Current HS GPA</label>
            <input type="number" step="0.01" className="input"
              value={data.gpa ?? ""}
              onChange={e => setData({ gpa: e.target.value ? parseFloat(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="label"># of current college classes</label>
            <input type="number" className="input"
              value={data.numCollegeClasses ?? ""}
              onChange={e => setData({ numCollegeClasses: e.target.value ? parseInt(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="label">College credits taken (editable)</label>
            <input type="number" className="input"
              value={data.credits ?? ""}
              onChange={e => setData({ credits: e.target.value ? parseInt(e.target.value) : undefined })} />
          </div>
        </div>

        <div className="grid-2">
          <div className="border rounded-xl p-4">
            <div className="font-medium mb-2">Eligibility Visual</div>
            <p className="text-sm">
              Status: <span className="badge">{elig.status}</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="border rounded-xl p-3">
                <div className="text-slate-500">Clock Started</div>
                <div className="text-lg font-semibold">{elig.clockStarted ? "Yes" : "No"}</div>
              </div>
              <div className="border rounded-xl p-3">
                <div className="text-slate-500">Years Remaining</div>
                <div className="text-lg font-semibold">{elig.yearsRemaining}</div>
              </div>
              <div className="border rounded-xl p-3">
                <div className="text-slate-500">Gap Year Available</div>
                <div className="text-lg font-semibold">{elig.gapYear ? "Yes" : "No"}</div>
              </div>
              <div className="border rounded-xl p-3">
                <div className="text-slate-500">Redshirt Used</div>
                <div className="text-lg font-semibold">{elig.redshirtUsed ? "Yes" : "No"}</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Example: 22 credits → clock not started; 24+ credits → clock started (uses redshirt path).
            </p>
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-medium mb-2">Residency & FAFSA</div>
            <label className="label">Residency</label>
            <select className="select" value={data.residency ?? ""}
              onChange={(e)=>setData({ residency: e.target.value as any })}>
              <option value="" disabled>Select...</option>
              <option>Citizen</option>
              <option>Permanent Resident</option>
              <option>Other</option>
            </select>
            <div className="mt-3 text-sm">
              FAFSA Eligible: <span className="badge">{isFAFSAEligible(data.residency) ? "Yes" : "No (auto)"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="font-semibold">Soccer Goals & Preferences</h2>
        <div className="grid-3">
          <div>
            <label className="label">Desired level of college soccer</label>
            <select className="select" value={data.desiredLevel ?? "Undecided"} onChange={e=>setData({ desiredLevel: e.target.value as any })}>
              <option>Undecided</option>
              <option>NCAA D1</option>
              <option>NCAA D2</option>
              <option>NCAA D3</option>
              <option>NAIA</option>
            </select>
          </div>
          <div>
            <label className="label">Academic eligibility for target schools?</label>
            <select className="select" value={data.academicallyEligible ?? "Unsure"} onChange={e=>setData({ academicallyEligible: e.target.value as any })}>
              <option>Yes</option>
              <option>No</option>
              <option>Unsure</option>
            </select>
          </div>
          <div>
            <label className="label">PCDA semesters</label>
            <select className="select" value={data.semesters ?? 2} onChange={e=>setData({ semesters: parseInt(e.target.value) as any })}>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Desired list of schools (multi-select)</label>
          <select multiple className="select h-48"
            value={data.desiredSchools}
            onChange={(e)=>{
              const vals = Array.from(e.target.selectedOptions).map(o=>o.value);
              setData({ desiredSchools: vals });
            }}>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name} • {c.governingBody}{c.division?` ${c.division}`:""} • {c.location}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">
            Each college stores COA, location, average class size, and last 2 season records.
          </p>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="font-semibold">Financial Planner</h2>
        <div className="grid-3">
          <div>
            <div className="label">Flexible down payment</div>
            <input type="number" className="input"
              value={data.downPayment ?? ""}
              onChange={e=>setData({ downPayment: e.target.value ? parseInt(e.target.value) : 0 })} />
          </div>
          <div>
            <div className="label">Work hours/week</div>
            <input type="number" className="input"
              value={data.workHoursPerWeek ?? ""}
              onChange={e=>setData({ workHoursPerWeek: e.target.value ? parseInt(e.target.value) : 0 })} />
          </div>
          <div>
            <div className="label">Visit date</div>
            <input type="date" className="input"
              value={data.visitDate ?? ""}
              onChange={e=>setData({ visitDate: e.target.value })} />
          </div>
        </div>
        <div className="grid-3">
          <div>
            <div className="label">Hourly rate (assumption)</div>
            <input type="number" className="input" value={hourlyRate} onChange={e=>setHourlyRate(parseInt(e.target.value || "0"))} />
          </div>
          <div>
            <div className="label">Weeks</div>
            <input type="number" className="input" value={weeks} onChange={e=>setWeeks(parseInt(e.target.value || "0"))} />
          </div>
          <div>
            <div className="label">Program start date</div>
            <input type="date" className="input"
              value={data.startDate ?? ""}
              onChange={e=>setData({ startDate: e.target.value })} />
          </div>
        </div>

        <div className="grid-3">
          <div className="border rounded-xl p-4">
            <div className="text-slate-500 text-sm">Base Fee</div>
            <div className="text-2xl font-bold">${fin.base.toLocaleString()}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-slate-500 text-sm">FAFSA Estimate</div>
            <div className="text-2xl font-bold">${fin.fafsaEstimate.toLocaleString()}</div>
            <div className="text-xs text-slate-500">{fin.fafsaEligible ? "Eligible" : "Not eligible"}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-slate-500 text-sm">Work Offset</div>
            <div className="text-2xl font-bold">${fin.workOffset.toLocaleString()}</div>
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-slate-500 text-sm">Remaining Balance</div>
          <div className="text-3xl font-extrabold">${fin.remaining.toLocaleString()}</div>
        </div>

        <a className="btn btn-primary" href="/summary">Generate Summary</a>
      </section>
    </div>
  );
}
