export default function SummaryCard({ title, value, hint }) {
    return (
        <div className="rounded-xl border border-rtap-border bg-slate-950/60 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
            {hint && (
                <div className="mt-1 text-xs text-slate-500">{hint}</div>
            )}
        </div>
    );
}
