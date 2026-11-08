import { readColorTokens } from "@/lib/tokens"

/** Token names, light and dark values, and swatches, all read from packages/styles/glob-ui.css at build time. */
export function TokenTable() {
  const tokens = readColorTokens()
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-fd-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-fd-muted text-fd-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Token</th>
            <th className="px-3 py-2 font-medium">Light</th>
            <th className="px-3 py-2 font-medium">Dark</th>
            <th className="px-3 py-2 font-medium">Swatch</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.name} className="border-t border-fd-border">
              <td className="px-3 py-2 font-mono text-xs">--glob-{t.name}</td>
              <td className="px-3 py-2 font-mono text-xs">{t.light}</td>
              <td className="px-3 py-2 font-mono text-xs">{t.dark}</td>
              <td className="px-3 py-2">
                <span
                  aria-hidden="true"
                  className="block h-6 w-16 overflow-hidden rounded border border-fd-border"
                  style={{ background: `linear-gradient(90deg, ${t.light} 50%, ${t.dark} 50%)` }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
