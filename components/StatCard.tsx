import { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-semibold tracking-tight mt-1">{value}</p>
        </div>
        {icon ? <div className="text-slate-500">{icon}</div> : null}
      </div>
    </div>
  );
}
