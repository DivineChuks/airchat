import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-center">
      <Settings className="mb-3 h-8 w-8 text-neutral-400" />
      <h1 className="text-sm font-medium text-neutral-700">Settings coming soon</h1>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        Admin credentials, data source configuration, and other settings will live here.
      </p>
    </div>
  );
}
