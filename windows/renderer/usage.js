import { React } from "./react.js";
import {
  isFiniteNumber,
  formatNumber,
  formatCurrency,
  remainingQuota,
  sumKnown,
  formatCountdown,
  quotaWindows,
  taskLabel,
  creditValue,
  dayKey,
  filterDays,
  Icon,
  ProviderIcon,
  Notice,
  EmptyState,
  QuotaRing,
  PROVIDER_LABELS,
  useApp,
} from "./common.js";
function QuotaCapsule({ compact: t = !1, onClick: e }) {
  let { snapshot: a, t: l, now: n } = useApp(),
    { settings: i } = a,
    u =
      Object.keys(a.quotas).find((g) => g === "codex" && a.quotas[g]) ||
      Object.keys(a.quotas).find((g) => a.quotas[g]),
    o = a.quotas[u],
    c = quotaWindows(o)
      .filter((g) => !/spark/i.test(g.limitId || g.name || ""))
      .slice(0, t ? 1 : 2),
    r = i.privacy
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(Icon, { name: "eyeOff", size: 13 }),
          React.createElement(
            "span",
            null,
            l("\u9690\u79C1\u6A21\u5F0F", "Privacy mode"),
          ),
        )
      : c.length
        ? c.map((g, m) => {
            let f = remainingQuota(g);
            return React.createElement(
              React.Fragment,
              { key: g.name || m },
              m > 0 &&
                React.createElement("i", {
                  className: "capsule-divider",
                }),
              React.createElement(
                "span",
                { className: "capsule-window" },
                React.createElement(QuotaRing, { value: f }),
                !t &&
                  React.createElement(
                    "span",
                    { className: "capsule-window-name" },
                    taskLabel(g, l),
                  ),
                i.showRemainingQuota &&
                  React.createElement(
                    "strong",
                    null,
                    f === null ? "\u2014" : `${Math.round(f)}%`,
                  ),
                React.createElement(
                  React.Fragment,
                  null,
                  i.showResetCountdown &&
                    React.createElement(
                      "span",
                      { className: "capsule-reset" },
                      formatCountdown(g.resetAt, n, l),
                      !t && isFiniteNumber(g.resetAt) && g.resetAt > n
                        ? l("\u91CD\u7F6E", " reset")
                        : "",
                    ),
                ),
              ),
            );
          })
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(QuotaRing, { value: null }),
            React.createElement(
              "span",
              null,
              l("\u989D\u5EA6\u672A\u77E5", "Quota unavailable"),
            ),
          );
  return e
    ? React.createElement(
        "button",
        {
          type: "button",
          className: `quota-capsule ${t ? "compact" : ""} ${o?.error ? "stale" : ""}`,
          title:
            o?.error ||
            l("\u67E5\u770B\u7528\u91CF\u7EDF\u8BA1", "View usage statistics"),
          onClick: e,
        },
        r,
      )
    : React.createElement(
        "div",
        { className: `quota-capsule ${t ? "compact" : ""}` },
        r,
      );
}
function QuotaWindow({ window: t, stale: e }) {
  let { t: a, locale: l, now: n, snapshot: i } = useApp(),
    u = remainingQuota(t),
    o = i.settings.privacy,
    c = isFiniteNumber(t.resetAt)
      ? new Date(t.resetAt).toLocaleString(l)
      : null;
  return React.createElement(
    "article",
    { className: `data-card quota-card ${e ? "stale-data" : ""}` },
    React.createElement(
      "div",
      { className: "card-title-line" },
      React.createElement("span", null, taskLabel(t, a)),
      React.createElement(
        "span",
        { className: "eyebrow" },
        a("\u5269\u4F59", "Remaining"),
      ),
    ),
    React.createElement(
      "div",
      { className: "quota-value" },
      React.createElement(
        "span",
        null,
        o
          ? "\u2022\u2022\u2022"
          : i.settings.showRemainingQuota
            ? u === null
              ? "\u2014"
              : Math.round(u)
            : "\u2014",
        !o &&
          i.settings.showRemainingQuota &&
          u !== null &&
          React.createElement("small", null, "%"),
      ),
      React.createElement(QuotaRing, { value: o ? null : u, size: 32 }),
    ),
    React.createElement(
      "div",
      {
        className: `quota-bar ${u === null ? "unknown" : ""}`,
        role: "progressbar",
        "aria-label":
          t.name || a("\u5269\u4F59\u989D\u5EA6", "Quota remaining"),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": o || u === null ? void 0 : u,
      },
      React.createElement("span", {
        className:
          u !== null && u <= 10
            ? "danger"
            : u !== null && u <= 30
              ? "warning"
              : "",
        style: { width: o || u === null ? "0%" : `${u}%` },
      }),
    ),
    React.createElement(
      "div",
      { className: "card-footnote", title: o ? "" : c || "" },
      React.createElement(Icon, { name: "clock", size: 12 }),
      o || !i.settings.showResetCountdown
        ? a("\u65F6\u95F4\u5DF2\u9690\u85CF", "Time hidden")
        : c
          ? t.resetAt <= n
            ? a(
                "\u7B49\u5F85\u5237\u65B0\u91CD\u7F6E\u65F6\u95F4",
                "Awaiting refreshed reset time",
              )
            : a(
                `${formatCountdown(t.resetAt, n, a)}\u540E\u91CD\u7F6E`,
                `Resets in ${formatCountdown(t.resetAt, n, a)}`,
              )
          : a("\u91CD\u7F6E\u65F6\u95F4\u672A\u77E5", "Reset time unavailable"),
    ),
  );
}
function UsageChart({ days: t, metric: e }) {
  let { t: a, locale: l, snapshot: n } = useApp(),
    i = n.settings.privacy,
    u = t.map((p) => (isFiniteNumber(p[e]) && p[e] >= 0 ? p[e] : null)),
    o = Math.max(...u.filter(isFiniteNumber), 1),
    c = 420,
    r = 90,
    g = c / Math.max(t.length, 1),
    m = Math.max(2, g - 3),
    f = sumKnown(t, e);
  return React.createElement(
    "div",
    { className: "history-chart" },
    React.createElement(
      "div",
      { className: "chart-summary" },
      React.createElement(
        "strong",
        null,
        i
          ? "\u2022\u2022\u2022"
          : e === "cost"
            ? formatCurrency(f, l)
            : formatNumber(f, l, !0),
      ),
      React.createElement(
        "span",
        null,
        e === "cost"
          ? a(
              "\u5DF2\u8BB0\u5F55\u4F30\u7B97\u6210\u672C",
              "Recorded estimated cost",
            )
          : a("\u5DF2\u8BB0\u5F55 Tokens", "Recorded tokens"),
      ),
    ),
    t.length && !i
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "svg",
            {
              viewBox: `0 0 ${c} ${r + 4}`,
              preserveAspectRatio: "none",
              role: "img",
              "aria-label":
                e === "cost"
                  ? a(
                      "\u6BCF\u65E5\u6210\u672C\u56FE\u8868",
                      "Daily cost chart",
                    )
                  : a(
                      "\u6BCF\u65E5 Token \u7528\u91CF\u56FE\u8868",
                      "Daily token chart",
                    ),
            },
            React.createElement("path", {
              d: `M0 ${r}H${c}`,
              className: "chart-baseline",
            }),
            t.map((p, w) => {
              let N = u[w],
                D =
                  N === null
                    ? 0
                    : N === 0
                      ? 1
                      : Math.max(2, (N / o) * (r - 10));
              return React.createElement(
                "g",
                { key: `${p.date}-${w}` },
                N !== null
                  ? React.createElement(
                      "rect",
                      {
                        x: w * g + 1,
                        y: r - D,
                        width: m,
                        height: D,
                        rx: Math.min(3, m / 2),
                        className: `history-bar ${e === "cost" ? "cost" : ""}`,
                      },
                      React.createElement(
                        "title",
                        null,
                        `${p.date}: ${e === "cost" ? formatCurrency(N, l) : formatNumber(N, l)}`,
                      ),
                    )
                  : React.createElement(
                      "path",
                      {
                        className: "missing-bar",
                        d: `M${w * g + 1} ${r - 3}h${m}`,
                      },
                      React.createElement(
                        "title",
                        null,
                        `${p.date}: ${a("\u672A\u77E5", "Unknown")}`,
                      ),
                    ),
              );
            }),
          ),
          React.createElement(
            "div",
            { className: "chart-axis" },
            React.createElement("span", null, t[0]?.date),
            React.createElement("span", null, t.at(-1)?.date),
          ),
          React.createElement(
            "p",
            { className: "chart-note" },
            a(
              "\u7A7A\u7F3A\u8868\u793A\u6CA1\u6709\u8BB0\u5F55\uFF0C\u4E0D\u4EE3\u8868\u96F6\u7528\u91CF\u3002",
              "Missing records are unknown, not zero usage.",
            ),
          ),
        )
      : React.createElement(
          "div",
          { className: "chart-empty" },
          i
            ? a(
                "\u9690\u79C1\u6A21\u5F0F\u5DF2\u9690\u85CF\u7528\u91CF",
                "Usage is hidden in privacy mode",
              )
            : a(
                "\u6682\u65E0\u53EF\u7528\u7684\u5386\u53F2\u8BB0\u5F55",
                "No usage history available",
              ),
        ),
  );
}
function ActivityChart({ days: t }) {
  let { t: e, locale: a, snapshot: l } = useApp(),
    n = Math.max(
      1,
      ...t.filter((i) => isFiniteNumber(i.total)).map((i) => i.total),
    );
  return React.createElement(
    "div",
    { className: "data-card activity-card" },
    React.createElement(
      "div",
      { className: "card-title-line" },
      React.createElement(
        "span",
        null,
        e("Token \u6D3B\u52A8", "Token activity"),
      ),
      React.createElement(Icon, { name: "chart", size: 15 }),
    ),
    l.settings.privacy
      ? React.createElement(
          "p",
          { className: "muted" },
          e("\u6570\u636E\u5DF2\u9690\u85CF", "Data hidden"),
        )
      : t.length
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "div",
              {
                className: "activity-cells",
                role: "img",
                "aria-label": e(
                  "\u6BCF\u65E5 Token \u6D3B\u52A8",
                  "Daily token activity",
                ),
              },
              t.map((i, u) =>
                React.createElement("span", {
                  key: `${i.date}-${u}`,
                  className: `activity-cell ${isFiniteNumber(i.total) ? "" : "unknown"}`,
                  style: isFiniteNumber(i.total)
                    ? {
                        "--level":
                          i.total === 0 ? 0.06 : 0.25 + (0.75 * i.total) / n,
                      }
                    : void 0,
                  title: `${i.date} \xB7 ${formatNumber(i.total, a)} tokens`,
                }),
              ),
            ),
            React.createElement(
              "div",
              { className: "activity-legend" },
              React.createElement("span", null, e("\u4F4E", "Less")),
              [0.1, 0.3, 0.5, 0.75, 1].map((i) =>
                React.createElement("i", {
                  key: i,
                  style: { "--level": i },
                }),
              ),
              React.createElement("span", null, e("\u9AD8", "More")),
            ),
          )
        : React.createElement(
            "p",
            { className: "muted" },
            e(
              "\u65B0\u7684\u4EFB\u52A1\u8BB0\u5F55\u51FA\u73B0\u540E\uFF0C\u6D3B\u52A8\u5C06\u5728\u8FD9\u91CC\u663E\u793A\u3002",
              "Activity appears here as new task records become available.",
            ),
          ),
  );
}
function UsageView({ full: e = !1 }) {
  let { snapshot: a, t: l, locale: n, now: i, setSetting: u } = useApp(),
    [o, c] = React.useState("codex"),
    r = a.settings,
    g = r.tokenActivityRange || "month",
    m = { week: 7, month: 30, threeMonths: 90, sixMonths: 180 }[g] || 30,
    f = a.quotas[o],
    p = a.usage[o],
    w = quotaWindows(f).filter(
      (E) =>
        r.showSparkQuota ||
        !/spark/i.test([E.limitId, E.label, E.name].join(" ")),
    ),
    N = f?.account,
    D = React.useMemo(() => filterDays(p?.days, m, i), [p, m, i]),
    v = React.useMemo(
      () => filterDays(p?.localDays || p?.days, m, i),
      [p, m, i],
    ),
    d = [
      "codex",
      "claude",
      ...["dsh", "kimi"].filter((E) => a.quotas[E] || a.usage[E]),
    ],
    h = p?.source === "codex-account",
    x = p?.partial || p?.incomplete || p?.localPartial,
    T = p?.days?.find((E) => E.date === dayKey(i)),
    M = [
      [
        r.showDailyTokens,
        l("\u4ECA\u65E5\u5DF2\u8BB0\u5F55", "Recorded today"),
        T?.total,
      ],
      [
        r.showThirtyDayTokens,
        l("30 \u5929\u5DF2\u8BB0\u5F55", "Recorded in 30 days"),
        sumKnown(filterDays(p?.days, 30, i), "total"),
      ],
      [
        r.showLifetimeTokens,
        isFiniteNumber(p?.summary?.lifetimeTokens)
          ? l("\u8D26\u6237\u7D2F\u8BA1", "Account lifetime")
          : l(
              "\u672C\u5730\u7D2F\u8BA1\uFF08\u53EF\u80FD\u4E0D\u5B8C\u6574\uFF09",
              "Local total (may be partial)",
            ),
        isFiniteNumber(p?.summary?.lifetimeTokens)
          ? p.summary.lifetimeTokens
          : sumKnown(p?.days || [], "total"),
      ],
    ].filter(([E]) => E);
  return React.createElement(
    "div",
    { className: `usage-panel ${e ? "full" : ""}` },
    React.createElement(
      "div",
      {
        className: "usage-provider-tabs",
        role: "tablist",
        "aria-label": l("\u6570\u636E\u6765\u6E90", "Data provider"),
      },
      d.map((E) =>
        React.createElement(
          "button",
          {
            role: "tab",
            "aria-selected": o === E,
            className: o === E ? "selected" : "",
            key: E,
            onClick: () => c(E),
          },
          React.createElement(ProviderIcon, { provider: E, size: 14 }),
          PROVIDER_LABELS[E],
        ),
      ),
    ),
    f?.error &&
      React.createElement(
        Notice,
        { tone: "warning" },
        l(
          "\u6700\u65B0\u6570\u636E\u83B7\u53D6\u5931\u8D25\u3002\u5DF2\u6709\u6570\u636E\u53EF\u80FD\u8FC7\u671F\u3002",
          "The latest fetch failed. Existing data may be stale.",
        ),
        React.createElement(
          "details",
          null,
          React.createElement("summary", null, l("\u8BE6\u60C5", "Details")),
          f.error,
        ),
      ),
    React.createElement(
      "div",
      { className: "data-card account-card" },
      React.createElement(
        "div",
        { className: "account-identity" },
        React.createElement(ProviderIcon, { provider: o, size: 28 }),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            r.privacy
              ? l("\u8D26\u6237\u5DF2\u9690\u85CF", "Account hidden")
              : N?.plan || PROVIDER_LABELS[o],
          ),
          React.createElement(
            "p",
            null,
            r.privacy
              ? "\u2022\u2022\u2022\u2022\u2022\u2022"
              : N?.email ||
                  l(
                    "\u8D26\u6237\u4FE1\u606F\u672A\u77E5",
                    "Account information unavailable",
                  ),
          ),
        ),
      ),
      React.createElement(
        "span",
        {
          className: `status-label ${a.providers[o]?.connected ? "success" : ""}`,
        },
        a.providers[o]?.connected
          ? l("\u6570\u636E\u6709\u6548", "Data available")
          : l("\u7B49\u5F85\u6570\u636E", "Awaiting data"),
      ),
    ),
    w.length
      ? React.createElement(
          "div",
          { className: "quota-grid" },
          w.map((E, C) =>
            React.createElement(QuotaWindow, {
              key: E.name || C,
              window: E,
              stale: !!f?.error,
            }),
          ),
        )
      : React.createElement(
          "div",
          { className: "data-card" },
          React.createElement(
            EmptyState,
            {
              icon: "chart",
              title: l(
                "\u6682\u65E0\u989D\u5EA6\u5FEB\u7167",
                "No quota snapshot yet",
              ),
            },
            l(
              "\u8FDE\u63A5\u5DF2\u767B\u5F55\u7684\u5BA2\u6237\u7AEF\u5E76\u5237\u65B0\u3002\u672A\u77E5\u989D\u5EA6\u4E0D\u4F1A\u663E\u793A\u4E3A 0%\u3002",
              "Connect a signed-in client and refresh. Unavailable quota is never shown as 0%.",
            ),
          ),
        ),
    r.showCreditBalance &&
      React.createElement(
        "div",
        { className: "data-card credits-card" },
        r.showCreditBalance &&
          React.createElement(
            "div",
            null,
            React.createElement(
              "span",
              { className: "eyebrow" },
              l("\u53EF\u7528\u79EF\u5206", "Available credits"),
            ),
            React.createElement(
              "strong",
              null,
              r.privacy
                ? "\u2022\u2022\u2022"
                : f?.credits?.unlimited
                  ? l("\u65E0\u9650", "Unlimited")
                  : formatNumber(creditValue(f?.credits?.balance), n),
            ),
          ),
      ),
    r.showUsageSummary &&
      M.length > 0 &&
      React.createElement(
        "div",
        { className: "usage-summary-stats" },
        M.map(([, E, C]) =>
          React.createElement(
            "div",
            { className: "usage-summary-stat", key: E },
            React.createElement("span", null, E),
            React.createElement(
              "strong",
              null,
              r.privacy ? "\u2022\u2022\u2022" : formatNumber(C, n, !0),
            ),
          ),
        ),
      ),
    (r.showTokens || r.showCost || r.showActivity) &&
      React.createElement(
        "div",
        { className: "usage-section-heading" },
        React.createElement(
          "h3",
          null,
          l("\u5386\u53F2\u7528\u91CF", "Usage history"),
        ),
        React.createElement(
          "select",
          {
            value: g,
            "aria-label": l("\u5386\u53F2\u8303\u56F4", "History range"),
            onChange: (E) => u("tokenActivityRange", E.target.value),
          },
          [
            ["week", l("7 \u5929", "7 days")],
            ["month", l("30 \u5929", "30 days")],
            ["threeMonths", l("90 \u5929", "90 days")],
            ["sixMonths", l("180 \u5929", "180 days")],
          ].map(([E, C]) =>
            React.createElement("option", { key: E, value: E }, C),
          ),
        ),
      ),
    r.showTokens &&
      React.createElement(
        "div",
        { className: "data-card" },
        React.createElement(
          "div",
          { className: "card-title-line" },
          React.createElement("span", null, "Tokens"),
          React.createElement(
            "span",
            { className: "muted" },
            h
              ? l("\u8D26\u6237\u7EDF\u8BA1", "Account statistics")
              : l("\u672C\u5730\u8BB0\u5F55", "Local records"),
          ),
        ),
        React.createElement(UsageChart, { days: D, metric: "total" }),
        React.createElement(
          "div",
          { className: "token-breakdown" },
          [
            ["input", l("\u8F93\u5165", "Input")],
            ["output", l("\u8F93\u51FA", "Output")],
            ["cached", l("\u5DF2\u7F13\u5B58", "Cached")],
          ].map(([E, C]) =>
            React.createElement(
              "div",
              { key: E },
              React.createElement("span", null, C),
              React.createElement(
                "strong",
                null,
                r.privacy
                  ? "\u2022\u2022\u2022"
                  : formatNumber(sumKnown(v, E), n, !0),
              ),
            ),
          ),
        ),
        h &&
          React.createElement(
            "p",
            { className: "chart-note" },
            l(
              "\u603B\u91CF\u91C7\u7528\u8D26\u6237\u7EDF\u8BA1\uFF1B\u4E0B\u65B9\u7EC6\u5206\u6765\u81EA\u672C\u5730\u8BB0\u5F55\uFF0C\u4E24\u8005\u4E0D\u76F8\u52A0\u3002",
              "Totals use account statistics. The breakdown uses local records; the two are not added together.",
            ),
          ),
      ),
    r.showCost &&
      React.createElement(
        "div",
        { className: "data-card" },
        React.createElement(
          "div",
          { className: "card-title-line" },
          React.createElement(
            "span",
            null,
            l("\u672C\u5730\u6210\u672C\u4F30\u7B97", "Local cost estimate"),
          ),
          React.createElement("span", { className: "muted" }, "USD"),
        ),
        React.createElement(UsageChart, { days: v, metric: "cost" }),
        React.createElement(
          "p",
          { className: "chart-note" },
          l(
            "\u6309\u53EF\u8BC6\u522B\u6A21\u578B\u7684 API \u4EF7\u683C\u4F30\u7B97\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u7B49\u4E8E\u8BA2\u9605\u8D26\u5355\uFF1B\u672A\u77E5\u6A21\u578B\u548C\u7F3A\u5931\u4EF7\u683C\u663E\u793A\u201C\u2014\u201D\u3002",
            "Local records estimated at recognizable-model API prices, not your subscription bill. Unknown models or prices are shown as \u201C\u2014\u201D.",
          ),
        ),
      ),
    r.showActivity && React.createElement(ActivityChart, { days: D }),
    React.createElement(
      "p",
      { className: "source-note" },
      React.createElement(Icon, { name: "clock", size: 12 }),
      f?.updatedAt
        ? l("\u5FEB\u7167\u66F4\u65B0\u4E8E ", "Snapshot updated ") +
            new Date(f.updatedAt).toLocaleString(n)
        : l(
            "\u5C1A\u672A\u83B7\u5F97\u6709\u6548\u5FEB\u7167",
            "No valid snapshot received yet",
          ),
    ),
    x &&
      React.createElement(
        "p",
        { className: "chart-note" },
        l(
          "\u672C\u5730\u5386\u53F2\u8BFB\u53D6\u6709\u8FB9\u754C\uFF0C\u8BB0\u5F55\u53EF\u80FD\u4E0D\u5B8C\u6574\u3002\u7D2F\u8BA1\u503C\u4EC5\u8986\u76D6\u53EF\u8BFB\u5230\u7684\u6570\u636E\u3002",
          "Local history is bounded and may be incomplete. Recorded totals cover only readable data.",
        ),
      ),
  );
}

export { QuotaCapsule, QuotaWindow, UsageChart, ActivityChart, UsageView };
