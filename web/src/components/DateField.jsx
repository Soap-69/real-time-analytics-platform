export default function DateField({ label, value, onChange }) {
    return (
        <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-rtap-border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rtap-accent/30 focus:border-rtap-accent"
            />
        </div>
    );
}
