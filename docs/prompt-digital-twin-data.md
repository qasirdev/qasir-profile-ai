## Task: Add OpenRouter observability header below the Digital Twin

Add a compact **metadata header/footer** directly **below the Digital Twin output** on every run. This repo has **one Digital Twin** that makes **one OpenRouter LLM call per run** — no multi-agent pipeline, no per-agent breakdown, no "Show agents" toggle.

Match this layout exactly:

```
⏱ 66648ms  🧠 29472 tokens  💰 $0.0046  🤖 deepseek/deepseek-v4-…  success
This visit: 7 runs · $0.015 (~$0.0021/run) · Lifetime (this browser): 41 runs · $0.021 (~$0.0005/run avg)
OpenRouter account (sk-or-v1-300…c32): all-time $0.604 · this month $0.567 · today $0.062 · $4.43 remaining
```

---

### Row 1 — current run metrics

After each OpenRouter `chat.completions` call, display:

| Metric | Source |
|--------|--------|
| Execution time | Wall-clock ms from request start to response |
| Tokens | `response.usage.total_tokens` |
| Cost | `response.usage.cost` (OpenRouter field; show `$0` if missing) |
| Model | `response.model` (truncate to ~28 chars + `…` if longer) |
| Status | `success` \| `failure` \| `degraded` (color: green / red / amber) |

Format cost:

```ts
function formatCostUsd(cost: number): string {
  if (cost === 0) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}
```

---

### Row 2 — browser session stats (localStorage)

Persist in `localStorage` on every successful run:

```ts
type UsageTracking = {
  cumulativeCostUsd: number;
  cumulativeRuns: number;
};
```

On page load, snapshot a baseline. Then show:

- **This visit:** runs and cost since page load + `~$X/run` average
- **Lifetime (this browser):** total runs and cost from localStorage + `~$X/run avg`

Increment `cumulativeRuns` by 1 and add run `cost_usd` after each successful Digital Twin run.

---

### Row 3 — OpenRouter account balance

Add a backend endpoint (e.g. `GET /api/usage/account`) that proxies:

```
GET https://openrouter.ai/api/v1/key
Authorization: Bearer {OPENROUTER_API_KEY}
```

Never expose the full API key to the browser. Return masked label (e.g. `sk-or-v1-300…c32`) plus:

- `usage` → all-time spend
- `usage_monthly` → this month
- `usage_daily` → today
- `limit_remaining` → remaining balance

Display as: `OpenRouter account ({label}): all-time $X · this month $X · today $X · $X remaining`

Fetch on page load and refresh after each Digital Twin run. If unavailable, hide the row or show a short fallback message.

---

### UI requirements

- Render below Digital Twin output; update without page refresh after each run
- Small rounded panel, subtle border, works in dark mode
- Use emoji prefixes: ⏱ 🧠 💰 🤖
- Add `title` and `aria-label` on each metric
- Follow this repo's existing styling conventions

---

### Definition of done

After a Digital Twin run, the user sees three lines: current-run metrics, visit/lifetime browser stats, and OpenRouter account balance (when configured).
