// Ad slot codes are admin-authored (Settings -> AdSense/Ad Slots), not public
// user input, so rendering the stored snippet is an intentional, trusted
// operation - the same pattern used by every ad network's embed snippet.
export function AdSlot({
  enabled,
  code,
  label,
  className,
}: {
  enabled: boolean;
  code: string;
  label: string;
  className?: string;
}) {
  if (!enabled) return null;

  if (!code.trim()) {
    return (
      <div
        className={`flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-400 ${className ?? ""}`}
      >
        {label} ad slot - configure in Admin &gt; Settings
      </div>
    );
  }

  return (
    <div
      className={className}
      data-ad-slot={label}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
