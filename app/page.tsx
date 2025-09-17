export default function Page() {
  return (
    <div className="container-narrow space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Interactive Sales Presentation</h1>
        <p className="text-slate-600">
          Use this tool live on your video call: enter the recruit's academic, soccer, and financial
          info and instantly generate a personalized PCDA journey with time and cost breakdowns.
        </p>
      </div>
      <div className="grid-3">
        <a className="card" href="/presentation">
          <h2 className="font-semibold mb-1">Presentation</h2>
          <p className="text-slate-600 text-sm">Overview flow for video calls.</p>
        </a>
        <a className="card" href="/intake">
          <h2 className="font-semibold mb-1">Start Intake</h2>
          <p className="text-slate-600 text-sm">Guided questions with conditional logic.</p>
        </a>
        <a className="card" href="/summary">
          <h2 className="font-semibold mb-1">View Summary</h2>
          <p className="text-slate-600 text-sm">Personalized pathway, timeline, and finances.</p>
        </a>
        <a className="card" href="/data/colleges">
          <h2 className="font-semibold mb-1">Manage Colleges</h2>
          <p className="text-slate-600 text-sm">Import/update NCAA/NAIA men’s soccer programs.</p>
        </a>
      </div>
    </div>
  );
}
