import Script from "next/script";

// Ad slot codes are admin-authored (Settings -> AdSense/Ad Slots), not public
// user input, so rendering the stored snippet is an intentional, trusted
// operation - the same pattern used by every ad network's embed snippet.
//
// Browsers never execute <script> elements inserted via innerHTML (the DOM
// spec marks them "already started"), so a plain dangerouslySetInnerHTML
// div would silently drop the script half of any pasted ad/verification
// snippet. Script tags are pulled out and rendered through next/script,
// which injects them the way a real <script> tag works; everything else
// in the snippet still renders via dangerouslySetInnerHTML.
function extractScripts(html: string) {
  const scripts: { attrs: Record<string, string>; content: string }[] = [];
  const markup = html.replace(
    /<script([^>]*)>([\s\S]*?)<\/script>/gi,
    (_match, attrsSource: string, content: string) => {
      const attrs: Record<string, string> = {};
      const attrPattern = /([a-zA-Z0-9-]+)(?:\s*=\s*"([^"]*)"|\s*=\s*'([^']*)')?/g;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrPattern.exec(attrsSource))) {
        attrs[attrMatch[1].toLowerCase()] = attrMatch[2] ?? attrMatch[3] ?? "true";
      }
      scripts.push({ attrs, content: content.trim() });
      return "";
    }
  );
  return { markup: markup.trim(), scripts };
}

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

  const { markup, scripts } = extractScripts(code);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <>
      {markup && (
        <div
          className={className}
          data-ad-slot={label}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      )}
      {scripts.map(({ attrs, content }, index) => {
        const { src, id, crossorigin, ...rest } = attrs;
        const scriptId = id || `${slug}-script-${index}`;
        const crossOrigin: "anonymous" | "use-credentials" | undefined =
          crossorigin === "anonymous" || crossorigin === "use-credentials" ? crossorigin : undefined;
        return src ? (
          <Script
            key={scriptId}
            id={scriptId}
            src={src}
            strategy="afterInteractive"
            crossOrigin={crossOrigin}
            {...rest}
          />
        ) : content ? (
          <Script
            key={scriptId}
            id={scriptId}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: content }}
            crossOrigin={crossOrigin}
            {...rest}
          />
        ) : null;
      })}
    </>
  );
}
