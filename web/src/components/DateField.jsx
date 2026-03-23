export default function DateField({ label, value, onChange }) {
    return (
        <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">
                {label}
            </label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-rtap-border bg-slate-900/80 px-3 py-2 text-sm"
            />
        </div>
    );
}
