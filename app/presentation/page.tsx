export default function PresentationPage() {
  return (
    <div className="container-narrow space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Interactive Sales Presentation</h1>
        <p className="text-slate-600">
          This page will guide you through the PCDA recruit meeting.
          Use the navigation or the buttons below to walk through intake and summary steps.
        </p>
      </div>

      <div className="grid-2">
        <a className="card" href="/intake">
          <h2 className="font-semibold mb-1">Start Intake</h2>
          <p className="text-slate-600 text-sm">
            Answer academic, residency, and soccer questions live on the call.
          </p>
        </a>
        <a className="card" href="/summary">
          <h2 className="font-semibold mb-1">View Summary</h2>
          <p className="text-slate-600 text-sm">
            Generate the personalized PCDA pathway with finances, timeline, and action items.
          </p>
        </a>
      </div>
    </div>
  );
}
