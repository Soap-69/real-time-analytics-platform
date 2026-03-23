export default function SummaryCard({ title, value, hint }) {
    return (
        <div className="rounded-xl border border-rtap-border bg-white shadow-card px-4 py-4">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {hint && (
                <div className="mt-1 text-xs text-gray-400">{hint}</div>
            )}
        </div>
    );
}
