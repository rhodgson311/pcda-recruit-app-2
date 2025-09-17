"use client";
import { useEffect, useRef, useState } from "react";
import { useStore, College } from "@/lib/store";

export default function CollegesPage() {
  const { loadColleges, colleges } = useStore();
  const [raw, setRaw] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/colleges.json").then(r => r.json()).then((list: College[]) => {
      loadColleges(list);
      setRaw(JSON.stringify(list, null, 2));
    }).catch(() => {
      // fallback to sample
      fetch("/sample-colleges.json").then(r => r.json()).then((list: College[]) => {
        loadColleges(list);
        setRaw(JSON.stringify(list, null, 2));
      });
    });
  }, [loadColleges]);

  const download = () => {
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "colleges.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(t => {
      setRaw(t);
      try {
        const list = JSON.parse(t);
        loadColleges(list);
      } catch (err) {
        alert("Invalid JSON");
      }
    });
  };

  return (
    <div className="container-narrow space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold">Manage College Dataset</h1>
        <p className="text-slate-600 text-sm">
          Upload a <code>colleges.json</code> with every U.S. public & private university that sponsors NCAA/NAIA men’s soccer,
          including COA, location, average class size, and last 2 seasons records.
        </p>
      </div>
      <div className="card space-y-4">
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={download}>Download Current JSON</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Upload JSON</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={upload} />
        </div>
        <textarea className="w-full h-96 font-mono border rounded-xl p-3" value={raw} onChange={(e)=>setRaw(e.target.value)} />
        <p className="text-xs text-slate-500">Changes here are in-memory. To persist, download and commit <code>public/colleges.json</code> in Git.</p>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Preview ({colleges.length})</h2>
        <ul className="space-y-2">
          {colleges.map(c => (
            <li key={c.id} className="border rounded-xl p-3">
              <div className="font-medium">{c.name} <span className="badge">{c.governingBody}{c.division ? ` ${c.division}` : ""}</span></div>
              <div className="text-sm text-slate-600">{c.location} • COA ${c.estimatedCOA.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
