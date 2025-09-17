"use client";
import { useEffect, useState } from "react";
import { useStore, isFAFSAEligible, eligibilityStatus, College, computeFinancials } from "@/lib/store";

export default function IntakePage() {
  const { data, setData, loadColleges, colleges, addAttendee, updateAttendee, removeAttendee } = useStore();
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
    hourlyRate, weeks, semesters: data.semesters ?? 2,
    planToUseFAFSA: data.planToUseFAFSA ?? "Yes"
  });

  return (
    <div className="container-narrow space-y-8">
      <div className="card">
        <h1 className="text-xl font-bold">Live Intake</h1>
        <p className="text-slate-600 text-sm">Fill this in real-time during your video call.</p>
      </div>

      {/* Contact & Meeting */}
      <section className="card space-y-4">
        <h2 className="font-semibold">Contact & Meeting Details</h2>
        <div className="grid-3">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={data.fullName ?? ""} onChange={e=>setData({ fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">NCAA eligibility number (if applicable)</label>
            <input className="input" value={data.ncaaEligibilityNumber ?? ""} onChange={e=>setData({ ncaaEligibilityNumber: e.target.value })} />
          </div>
          <div>
            <label className="label">Desired Major (if applicable)</label>
            <input className="input" value={data.desiredMajor ?? ""} onChange={e=>setData({ desiredMajor: e.target.value })} />
          </div>
        </div>
        <div className="grid-3">
          <div>
            <label className="label">Address line 1</label>
            <input className="input" value={data.address1 ?? ""} onChange={e=>setData({ address1: e.target.value })} />
          </div>
          <div>
            <label className="label">Address line 2</label>
            <input className="input" value={data.address2 ?? ""} onChange={e=>setData({ address2: e.target.value })} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={data.city ?? ""} onChange={e=>setData({ city: e.target.value })} />
          </div>
        </div>
        <div className="grid-3">
          <div>
            <label className="label">State</label>
            <input className="input" value={data.state ?? ""} onChange={e=>setData({ state: e.target.value })} />
          </div>
          <div>
            <label className="label">ZIP</label>
            <input className="input" value={data.zip ?? ""} onChange={e=>setData({ zip: e.target.value })} />
          </div>
          <div>
            <label className="label">High school graduation (Month/Year)</label>
            <input type="month" className="input" value={data.hsGradMonthYear ?? ""} onChange={e=>setData({ hsGradMonthYear: e.target.value })} />
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">People present in meeting</div>
            <button className="btn" onClick={addAttendee}>+ Add attendee</button>
          </div>
          <div className="mt-3 space-y-3">
            {(data.attendees ?? []).map((a, i) => (
              <div key={i} className="grid-3 items-end gap-3">
                <div>
                  <label className="label">Name</label>
                  <input className="input" value={a.name} onChange={e=>updateAttendee(i, { name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" value={a.email} onChange={e=>updateAttendee(i, { email: e.target.value })} />
                </div>
                <div className="pt-6">
                  <button className="btn" onClick={()=>removeAttendee(i)}>Remove</button>
                </div>
              </div>
            ))}
            {(!data.attendees || data.attendees.length === 0) && (
              <p className="text-sm text-slate-500">No attendees added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Academics */}
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
            <label className="label">Are you taking dual enrollment classes?</label>
            <select className="select" value={data.dualEnrollment ?? ""} onChange={e=>setData({ dualEnrollment: e.target.value as any })}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="label"># of current college classes</label>
            <input type="number" className="input"
              value={data.numCollegeClasses ?? ""}
              onChange={e => setData({ numCollegeClasses: e.target.value ? parseInt(e.target.value) : undefined })} />
          </div>
        </div>

        <div className="grid-3">
          <div>
            <label className="label">Total college credits taken (editable)</label>
            <input type="number" className="input"
              value={data.credits ?? ""}
              onChange={e => setData({ credits: e.target.value ? parseInt(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="label">ACT score (if applicable)</label>
            <input type="number" className="input"
              value={data.actScore ?? ""}
              onChange={e => setData({ actScore: e.target.value ? parseInt(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="label">SAT score (if applicable)</label>
            <input type="number" className="input"
              value={data.satScore ?? ""}
              onChange={e => setData({ satScore: e.target.value ? parseInt(e.target.value) : undefined })} />
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
              Thresholds: ≤11 credits → Gap year available; ≥12 credits → Redshirt/clock started.
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
            <div className="mt-3">
              <label className="label">Are you planning on using FAFSA for college?</label>
              <select className="select" value={data.planToUseFAFSA ?? "Yes"} onChange={(e)=>setData({ planToUseFAFSA: e.target.value as any })}
                disabled={!isFAFSAEligible(data.residency)}>
                <option>Yes</option>
                <option>No</option>
              </select>
              {!isFAFSAEligible(data.residency) && (
                <p className="text-xs text-slate-500 mt-2">Residency selected is not FAFSA-eligible. Planning toggle disabled.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Soccer & Colleges */}
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
            <label className="label">College offers (study and/or play)</label>
            <input className="input" placeholder="List schools if any" value={data.collegeOffers ?? ""} onChange={e=>setData({ collegeOffers: e.target.value })} />
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

      {/* Financials & Logistics */}
      <section className="card space-y-4">
        <h2 className="font-semibold">Financial Planner & Logistics</h2>
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
            <div className="text-xs text-slate-500">
              {fin.fafsaEligible ? (fin.willUseFAFSA ? "Eligible and planning to use" : "Eligible but not planning to use") : "Not eligible"}
            </div>
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
